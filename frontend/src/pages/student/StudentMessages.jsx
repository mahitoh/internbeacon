import { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Send, Briefcase } from 'lucide-react';
import { applicationsApi } from '../../api/applications';
import { messagesApi } from '../../api/messages';
import { useAuth } from '../../context/AuthContext';
import { useSocket } from '../../context/SocketContext';
import Avatar from '../../components/ui/Avatar';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';

export default function StudentMessages() {
  const { appId: urlAppId } = useParams();
  const { user }            = useAuth();
  const socket              = useSocket();
  const qc                  = useQueryClient();
  const [activeAppId,  setActiveAppId]  = useState(urlAppId ? String(urlAppId) : null);
  const [messages,     setMessages]     = useState([]);
  const [msgLoading,   setMsgLoading]   = useState(false);
  const [input,        setInput]        = useState('');
  const [sending,      setSending]      = useState(false);
  const bottomRef = useRef(null);

  const { data: threads } = useQuery({
    queryKey: ['message-threads-student'],
    queryFn:  () => messagesApi.threads().then(r => r.data.data),
  });

  // Auto-select first thread when loaded (if no URL param)
  useEffect(() => {
    if (!activeAppId && threads?.length > 0) {
      setActiveAppId(String(threads[0].appId));
    }
  }, [threads, activeAppId]);

  const activeThread = threads?.find(t => String(t.appId) === activeAppId);

  // For new threads: URL param points to an app with no messages yet — fetch app info for header
  const { data: freshApp } = useQuery({
    queryKey: ['app-for-new-thread', activeAppId],
    queryFn:  () => applicationsApi.getOne(activeAppId).then(r => r.data.data),
    enabled:  !!activeAppId && activeThread === undefined && threads !== undefined,
  });

  // Load messages on thread switch — clear first to avoid stale flash
  useEffect(() => {
    if (!activeAppId) return;
    setMessages([]);
    setMsgLoading(true);
    messagesApi.getThread(activeAppId)
      .then(r => setMessages(r.data.data || []))
      .finally(() => setMsgLoading(false));
  }, [activeAppId]);

  // Auto-scroll to bottom
  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  // Socket: join/leave room + receive messages + refresh thread list on new messages
  useEffect(() => {
    if (!socket || !activeAppId) return;
    socket.emit('join_thread', activeAppId);
    const onMessage = (msg) => {
      setMessages(prev => [...prev, msg]);
      qc.invalidateQueries({ queryKey: ['message-threads-student'] });
    };
    const onRead = ({ messageIds }) => {
      setMessages(prev => prev.map(m => messageIds.includes(m.id) ? { ...m, isRead: true } : m));
    };
    socket.on('new_message', onMessage);
    socket.on('messages_read', onRead);
    return () => {
      socket.off('new_message', onMessage);
      socket.off('messages_read', onRead);
      socket.emit('leave_thread', activeAppId);
    };
  }, [socket, activeAppId, qc]);

  const switchThread = (id) => {
    setActiveAppId(String(id));
    setInput('');
  };

  const sendMessage = async () => {
    if (!input.trim() || !activeAppId || sending) return;
    setSending(true);
    try {
      await messagesApi.send(activeAppId, input.trim());
      setInput('');
      qc.invalidateQueries({ queryKey: ['message-threads-student'] });
    } catch {
      // message arrives via socket
    } finally {
      setSending(false);
    }
  };

  // Header info: prefer live thread data, fall back to freshApp for new (zero-message) threads
  const headerTitle    = activeThread?.offer?.title ?? freshApp?.offer?.title ?? '…';
  const headerSubtitle = activeThread?.offer?.company_profiles?.company_name
    ?? freshApp?.offer?.company?.companyName
    ?? '';

  return (
    <div className="flex h-[calc(100vh-9rem)] bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
      {/* Conversation list */}
      <div className="w-64 flex-shrink-0 border-r border-white/5 flex flex-col">
        <div className="px-4 py-4 border-b border-white/5">
          <h3 className="font-semibold text-white text-sm">Messages</h3>
        </div>
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {threads === undefined ? (
            <div className="flex justify-center py-8"><Spinner size="sm" /></div>
          ) : threads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-white/20 text-xs text-center p-4">
              <Briefcase size={28} className="mb-2" />
              No conversations yet.<br />Apply to an offer to start chatting.
            </div>
          ) : threads.map(thread => (
            <button key={thread.appId}
              onClick={() => switchThread(thread.appId)}
              className={`w-full text-left px-4 py-3 hover:bg-white/5 transition-colors ${String(thread.appId) === activeAppId ? 'bg-lime-500/5 border-r-2 border-lime-500' : ''}`}>
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-white text-xs font-medium truncate">{thread.offer?.title}</p>
                  <p className="text-white/30 text-[11px] truncate mt-0.5">
                    {thread.offer?.company_profiles?.company_name}
                  </p>
                  {thread.lastMessage && (
                    <p className="text-white/20 text-[10px] truncate mt-0.5">{thread.lastMessage.content}</p>
                  )}
                </div>
                {thread.unreadCount > 0 && (
                  <span className="bg-lime-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold flex-shrink-0">
                    {thread.unreadCount}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      {!activeAppId ? (
        <div className="flex-1 flex items-center justify-center text-white/20">
          <div className="text-center">
            <Briefcase size={40} className="mx-auto mb-3" />
            <p className="text-sm">Select a conversation</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col">
          <div className="px-5 py-4 border-b border-white/5">
            <p className="text-white font-medium text-sm">{headerTitle}</p>
            <p className="text-white/40 text-xs">{headerSubtitle}</p>
          </div>

          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3 dashboard-scroll">
            {msgLoading ? (
              <div className="flex justify-center py-8"><Spinner /></div>
            ) : messages.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-white/20 text-sm">No messages yet. Say hello!</p>
              </div>
            ) : messages.map((msg, i) => {
              const isMe = msg.senderId === user?.id;
              return (
                <div key={msg.id || i} className={`flex gap-3 ${isMe ? 'flex-row-reverse' : ''}`}>
                  <Avatar name={isMe ? 'Me' : headerSubtitle} size="xs" />
                  <div className={`max-w-xs rounded-2xl px-4 py-2.5 ${isMe ? 'bg-lime-500 text-white rounded-tr-sm' : 'bg-white/5 text-white rounded-tl-sm'}`}>
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <p className={`text-[10px] mt-1 ${isMe ? 'text-white/60' : 'text-white/30'}`}>{formatRelativeTime(msg.sentAt)}</p>
                  </div>
                </div>
              );
            })}
            <div ref={bottomRef} />
          </div>

          <div className="px-5 py-4 border-t border-white/5">
            <div className="flex items-center gap-3 bg-white/5 rounded-xl px-4 py-2.5">
              <input
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                placeholder="Type a message…"
                className="flex-1 bg-transparent text-white text-sm placeholder:text-white/30 focus:outline-none"
              />
              <button onClick={sendMessage} disabled={sending}
                className="w-8 h-8 rounded-lg bg-lime-500 hover:bg-lime-600 flex items-center justify-center transition-colors disabled:opacity-50">
                <Send size={14} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
