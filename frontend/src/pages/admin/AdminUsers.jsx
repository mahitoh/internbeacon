import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, UserCheck, UserX, Trash2, Users, ShieldCheck, Shield } from 'lucide-react';
import { adminApi } from '../../api/admin';
import Spinner from '../../components/ui/Spinner';
import { formatRelativeTime } from '../../lib/utils';
import toast from 'react-hot-toast';

const ROLES = ['', 'student', 'company', 'admin'];

export default function AdminUsers() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [role,   setRole]   = useState('');
  const [page,   setPage]   = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', { search, role, page }],
    queryFn:  () => adminApi.listUsers({ search: search || undefined, role: role || undefined, page, limit: 20 }).then(r => r.data),
    placeholderData: (prev) => prev,
  });

  const users = data?.data || [];
  const meta  = data?.meta || { total: 0, page: 1 };

  const activateMutation = useMutation({
    mutationFn: ({ id, isActive }) => adminApi.setActive(id, isActive),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User status updated'); },
    onError:   () => toast.error('Failed to update user'),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => adminApi.deleteUser(id),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('User deleted'); },
    onError:   () => toast.error('Failed to delete user'),
  });

  const verifyMutation = useMutation({
    mutationFn: ({ id, isVerified }) => adminApi.verifyCompany(id, isVerified),
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['admin-users'] }); toast.success('Company verification updated'); },
    onError:   () => toast.error('Failed to update verification'),
  });

  const confirmDelete = (user) => {
    const name = user.studentProfile
      ? `${user.studentProfile.first_name} ${user.studentProfile.last_name}`
      : user.companyProfile?.company_name || user.email;
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) {
      deleteMutation.mutate(user.id);
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white">Users</h2>
          <p className="text-white/40 text-sm mt-0.5">{meta.total} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/30" />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email or name…"
            className="w-full pl-9 pr-4 py-2.5 bg-[#1a1a1a] border border-white/10 rounded-xl text-sm text-white placeholder:text-white/30 focus:outline-none focus:border-lime-500/50" />
        </div>
        <select value={role} onChange={e => { setRole(e.target.value); setPage(1); }}
          className="bg-[#1a1a1a] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-lime-500/50 appearance-none">
          <option value="" className="bg-[#1a1a1a]">All roles</option>
          <option value="student" className="bg-[#1a1a1a]">Students</option>
          <option value="company" className="bg-[#1a1a1a]">Companies</option>
          <option value="admin"   className="bg-[#1a1a1a]">Admins</option>
        </select>
      </div>

      {/* Table */}
      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="bg-[#1a1a1a] rounded-2xl border border-white/5 overflow-hidden">
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-white/20">
              <Users size={36} className="mb-3" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
            <table className="w-full min-w-[560px]">
              <thead>
                <tr className="border-b border-white/5">
                  {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-white/30 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {users.map(u => {
                  const name = u.studentProfile
                    ? `${u.studentProfile.first_name} ${u.studentProfile.last_name}`
                    : u.companyProfile?.company_name || '—';
                  const sub = u.studentProfile
                    ? u.studentProfile.university
                    : u.companyProfile?.sector || '';
                  return (
                    <tr key={u.id} className="hover:bg-white/2 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <p className="text-white text-sm font-medium">{name}</p>
                          {u.role === 'company' && u.companyProfile?.isVerified && (
                            <ShieldCheck size={13} className="text-lime-400 flex-shrink-0" title="Verified company" />
                          )}
                        </div>
                        <p className="text-white/40 text-xs mt-0.5">{u.email}</p>
                        {sub && <p className="text-white/25 text-xs">{sub}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium capitalize
                          ${u.role === 'student' ? 'bg-blue-500/10 text-blue-400' :
                            u.role === 'company' ? 'bg-purple-500/10 text-purple-400' :
                            'bg-lime-500/10 text-lime-400'}`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium
                          ${u.isActive ? 'bg-lime-500/10 text-lime-400' : 'bg-red-500/10 text-red-400'}`}>
                          {u.isActive ? 'Active' : 'Suspended'}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-xs text-white/40">{formatRelativeTime(u.createdAt)}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {u.role === 'company' && (
                            <button
                              onClick={() => verifyMutation.mutate({ id: u.id, isVerified: !u.companyProfile?.isVerified })}
                              title={u.companyProfile?.isVerified ? 'Remove verification' : 'Verify company'}
                              className={`p-1.5 rounded-lg transition-colors ${u.companyProfile?.isVerified ? 'text-lime-400 hover:bg-lime-500/10' : 'text-white/20 hover:text-lime-400 hover:bg-lime-500/10'}`}>
                              {u.companyProfile?.isVerified ? <ShieldCheck size={14} /> : <Shield size={14} />}
                            </button>
                          )}
                          <button
                            onClick={() => activateMutation.mutate({ id: u.id, isActive: !u.isActive })}
                            title={u.isActive ? 'Suspend user' : 'Activate user'}
                            className={`p-1.5 rounded-lg transition-colors ${u.isActive ? 'text-orange-400 hover:bg-orange-500/10' : 'text-lime-400 hover:bg-lime-500/10'}`}>
                            {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                          </button>
                          <button
                            onClick={() => confirmDelete(u)}
                            title="Delete user"
                            className="p-1.5 rounded-lg text-white/20 hover:text-red-400 hover:bg-red-500/10 transition-colors">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            </div>
          )}
        </div>
      )}

      {/* Pagination */}
      {meta.total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-xs text-white/40">
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors">
              Previous
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= meta.total}
              className="px-3 py-1.5 text-xs rounded-lg bg-white/5 text-white/60 hover:bg-white/10 disabled:opacity-30 transition-colors">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
