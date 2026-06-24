import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { Search, UserCheck, UserX, Trash2, Users, ShieldCheck, Shield, Eye, User, GraduationCap, Code2, Languages, FileText, Building2 } from 'lucide-react';
import { adminApi } from '../../api/admin';
import { uploadApi } from '../../api/upload';
import Spinner from '../../components/ui/Spinner';
import SelectField from '../../components/ui/SelectField';
import SlideOver, { DSection, DRow, DChips, DHero, DAvatar, DBadge } from '../../components/ui/SlideOver';
import CvViewerModal from '../../components/ui/CvViewerModal';
import { formatRelativeTime, formatDate } from '../../lib/utils';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const qc = useQueryClient();
  const [searchParams] = useSearchParams();
  const [search, setSearch] = useState(() => searchParams.get('search') || '');
  const [role,   setRole]   = useState(() => searchParams.get('role') || '');
  const [page,   setPage]   = useState(1);
  const [selectedId, setSelectedId] = useState(null);

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
    if (window.confirm(`Delete ${name}? This cannot be undone.`)) deleteMutation.mutate(user.id);
  };

  const selectStyle = {
    background: '#fff', border: '1px solid #DDDBD2', borderRadius: '12px',
    padding: '10px 32px 10px 12px', fontSize: '14px', color: '#6B6F69', outline: 'none', appearance: 'none',
  };

  return (
    <div className="space-y-5" style={{ fontFamily: "'Hanken Grotesk', system-ui, sans-serif" }}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black" style={{ color: '#1B1D1A' }}>Users</h2>
          <p className="text-sm mt-0.5" style={{ color: '#9A9E97' }}>{meta.total} registered users</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#9A9E97' }} />
          <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by email or name…"
            className="w-full pl-9 pr-4 py-2.5 text-sm rounded-xl focus:outline-none transition-colors"
            style={{ background: '#fff', border: '1px solid #DDDBD2', color: '#1B1D1A' }}
            onFocus={e => e.target.style.borderColor = '#1E5B45'}
            onBlur={e => e.target.style.borderColor = '#DDDBD2'} />
        </div>
        <SelectField bare value={role} onChange={e => { setRole(e.target.value); setPage(1); }} style={selectStyle}>
          <option value="">All roles</option>
          <option value="student">Students</option>
          <option value="company">Companies</option>
          <option value="admin">Admins</option>
        </SelectField>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20"><Spinner /></div>
      ) : (
        <div className="rounded-2xl overflow-hidden" style={{ background: '#fff', border: '1px solid #E7E6DF' }}>
          {users.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16" style={{ color: '#C0BFBA' }}>
              <Users size={36} className="mb-3 opacity-50" />
              <p className="text-sm">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead>
                  <tr style={{ borderBottom: '1px solid #E7E6DF' }}>
                    {['User', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide" style={{ color: '#9A9E97' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {users.map((u, i) => {
                    const name = u.studentProfile
                      ? `${u.studentProfile.first_name} ${u.studentProfile.last_name}`
                      : u.companyProfile?.company_name || '—';
                    const sub = u.studentProfile ? u.studentProfile.university : u.companyProfile?.sector || '';
                    const roleStyle = u.role === 'student'
                      ? { bg: '#DBEAFE', text: '#1E40AF' }
                      : u.role === 'company'
                        ? { bg: '#EDE9FE', text: '#5B21B6' }
                        : { bg: '#EDF2EE', text: '#1E5B45' };
                    return (
                      <tr key={u.id} className="transition-colors cursor-pointer"
                        style={{ borderTop: i > 0 ? '1px solid #F0F0EA' : 'none' }}
                        onClick={() => setSelectedId(u.id)}
                        onMouseEnter={e => e.currentTarget.style.background = '#FAFAF7'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-1.5">
                            <p className="text-sm font-medium" style={{ color: '#1B1D1A' }}>{name}</p>
                            {u.role === 'company' && u.companyProfile?.isVerified && (
                              <ShieldCheck size={13} style={{ color: '#1E5B45', flexShrink: 0 }} title="Verified company" />
                            )}
                          </div>
                          <p className="text-xs mt-0.5" style={{ color: '#9A9E97' }}>{u.email}</p>
                          {sub && <p className="text-xs" style={{ color: '#C0BFBA' }}>{sub}</p>}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold capitalize"
                            style={{ background: roleStyle.bg, color: roleStyle.text }}>
                            {u.role}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold"
                            style={u.isActive
                              ? { background: '#EDF2EE', color: '#1E5B45' }
                              : { background: '#FEE2E2', color: '#991B1B' }}>
                            {u.isActive ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-xs" style={{ color: '#9A9E97' }}>{formatRelativeTime(u.createdAt)}</span>
                        </td>
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            {u.role === 'company' && (
                              <button
                                onClick={() => verifyMutation.mutate({ id: u.id, isVerified: !u.companyProfile?.isVerified })}
                                title={u.companyProfile?.isVerified ? 'Remove verification' : 'Verify company'}
                                className="p-1.5 rounded-lg transition-colors"
                                style={{ color: u.companyProfile?.isVerified ? '#1E5B45' : '#C0BFBA' }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#EDF2EE'; e.currentTarget.style.color = '#1E5B45'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = u.companyProfile?.isVerified ? '#1E5B45' : '#C0BFBA'; }}>
                                {u.companyProfile?.isVerified ? <ShieldCheck size={14} /> : <Shield size={14} />}
                              </button>
                            )}
                            <button
                              onClick={() => activateMutation.mutate({ id: u.id, isActive: !u.isActive })}
                              title={u.isActive ? 'Suspend user' : 'Activate user'}
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: u.isActive ? '#D97706' : '#1E5B45' }}
                              onMouseEnter={e => { e.currentTarget.style.background = u.isActive ? '#FFFBEB' : '#EDF2EE'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}>
                              {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                            </button>
                            <button
                              onClick={() => confirmDelete(u)}
                              title="Delete user"
                              className="p-1.5 rounded-lg transition-colors"
                              style={{ color: '#C0BFBA' }}
                              onMouseEnter={e => { e.currentTarget.style.background = '#FEE2E2'; e.currentTarget.style.color = '#EF4444'; }}
                              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#C0BFBA'; }}>
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

      {meta.total > 20 && (
        <div className="flex items-center justify-between">
          <p className="text-xs" style={{ color: '#9A9E97' }}>
            Showing {(page - 1) * 20 + 1}–{Math.min(page * 20, meta.total)} of {meta.total}
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
              className="px-3 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-30"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { if (page > 1) e.currentTarget.style.borderColor = '#1E5B45'; }}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
              Previous
            </button>
            <button onClick={() => setPage(p => p + 1)} disabled={page * 20 >= meta.total}
              className="px-3 py-1.5 text-xs rounded-lg transition-colors disabled:opacity-30"
              style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#6B6F69' }}
              onMouseEnter={e => { if (page * 20 < meta.total) e.currentTarget.style.borderColor = '#1E5B45'; }}
              onMouseLeave={e => e.currentTarget.style.borderColor = '#DDDBD2'}>
              Next
            </button>
          </div>
        </div>
      )}

      <UserDetailDrawer
        userId={selectedId}
        onClose={() => setSelectedId(null)}
        onActivate={(id, isActive) => activateMutation.mutate({ id, isActive })}
        onVerify={(id, isVerified) => verifyMutation.mutate({ id, isVerified })}
        onDelete={(user) => { confirmDelete(user); setSelectedId(null); }}
      />
    </div>
  );
}

// ── User detail drawer ──────────────────────────────────────────────────────────
function UserDetailDrawer({ userId, onClose, onActivate, onVerify, onDelete }) {
  const [cvOpen, setCvOpen] = useState(false);
  const [cvUrl,  setCvUrl]  = useState('');

  const { data: u, isLoading } = useQuery({
    queryKey: ['admin-user', userId],
    queryFn:  () => adminApi.getUser(userId).then(r => r.data.data),
    enabled:  !!userId,
  });

  const sp = u?.studentProfile;
  const cp = u?.companyProfile;
  const name = sp ? `${sp.first_name || ''} ${sp.last_name || ''}`.trim()
    : cp?.company_name || u?.email || 'User';

  const viewCv = async () => {
    try {
      const r = await uploadApi.getCvUrl(userId);
      setCvUrl(r.data.data.url);
      setCvOpen(true);
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Could not load CV');
    }
  };

  const footer = u && (
    <div className="flex items-center gap-2">
      <button onClick={() => onActivate(u.id, !u.isActive)}
        className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        style={u.isActive
          ? { background: '#FFFBEB', border: '1px solid #FDE68A', color: '#B45309' }
          : { background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
        {u.isActive ? 'Suspend' : 'Activate'}
      </button>
      {u.role === 'company' && (
        <button onClick={() => onVerify(u.id, !cp?.is_verified)}
          className="flex-1 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          style={{ background: '#F6F5F1', border: '1px solid #DDDBD2', color: '#1B1D1A' }}>
          {cp?.is_verified ? 'Unverify' : 'Verify'}
        </button>
      )}
      <button onClick={() => onDelete(u)}
        className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        style={{ background: '#fff', border: '1px solid #FECACA', color: '#DC2626' }}>
        <Trash2 size={15} />
      </button>
    </div>
  );

  const roleTone = u?.role === 'student' ? 'blue' : u?.role === 'company' ? 'purple' : 'green';

  return (
    <>
      <SlideOver open={!!userId} onClose={onClose} eyebrow="User details" footer={footer}>
        {isLoading || !u ? (
          <div className="flex justify-center py-16"><Spinner /></div>
        ) : (
          <>
            <DHero
              avatar={<DAvatar name={name} src={sp?.avatar_url || cp?.logo_url} icon={cp ? Building2 : undefined} />}
              title={name}
              subtitle={u.email}
              badges={
                <>
                  <DBadge tone={roleTone}>{u.role}</DBadge>
                  <DBadge tone={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Suspended'}</DBadge>
                  {cp?.is_verified && <DBadge tone="green"><ShieldCheck size={11} /> Verified</DBadge>}
                  {!u.emailConfirmed && <DBadge tone="amber">Email unverified</DBadge>}
                </>
              }
            />

            <DSection title="Account" icon={User}>
              <DRow label="Joined" value={u.createdAt ? formatDate(u.createdAt) : null} />
              <DRow label="Last sign-in" value={u.lastSignIn ? formatRelativeTime(u.lastSignIn) : 'Never'} />
              <DRow label="Email confirmed" value={u.emailConfirmed ? 'Yes' : 'No'} />
            </DSection>

            {sp && (
              <>
                <DSection title="Education" icon={GraduationCap}>
                  <DRow label="University" value={sp.university} />
                  <DRow label="Faculty" value={sp.faculty} />
                  <DRow label="Programme" value={sp.programme} />
                  <DRow label="Study year" value={sp.study_year ? `Year ${sp.study_year}` : null} />
                  <DRow label="City" value={sp.city} />
                  <DRow label="Phone" value={sp.phone} />
                </DSection>
                <DSection title="Skills" icon={Code2}><DChips items={sp.skills} empty="No skills added" /></DSection>
                <DSection title="Languages" icon={Languages}><DChips items={sp.languages} empty="None listed" /></DSection>
                {sp.bio && (
                  <DSection title="Bio">
                    <p className="text-sm leading-relaxed" style={{ color: '#6B6F69' }}>{sp.bio}</p>
                  </DSection>
                )}
                <DSection title="CV & Links" icon={FileText}
                  action={sp.cv_url && (
                    <button onClick={viewCv} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold"
                      style={{ background: '#EDF2EE', border: '1px solid #C4DBCE', color: '#1E5B45' }}>
                      <Eye size={12} /> View CV
                    </button>
                  )}>
                  {!sp.cv_url && <p className="text-sm mb-1" style={{ color: '#C0BFBA' }}>No CV uploaded</p>}
                  <DRow label="LinkedIn" value={sp.linkedin_url} />
                  <DRow label="GitHub" value={sp.github_url} />
                </DSection>
              </>
            )}

            {cp && (
              <>
                <DSection title="Company" icon={Building2}>
                  <DRow label="Sector" value={cp.sector} />
                  <DRow label="Size" value={cp.employee_size ? `${cp.employee_size} employees` : null} />
                  <DRow label="City" value={cp.city} />
                  <DRow label="Address" value={cp.address} />
                  <DRow label="Phone" value={cp.phone} />
                  <DRow label="Website" value={cp.website_url} />
                </DSection>
                {cp.description && (
                  <DSection title="About">
                    <p className="text-sm leading-relaxed" style={{ color: '#6B6F69' }}>{cp.description}</p>
                  </DSection>
                )}
              </>
            )}
          </>
        )}
      </SlideOver>
      <CvViewerModal isOpen={cvOpen} onClose={() => setCvOpen(false)} url={cvUrl} candidateName={name} />
    </>
  );
}
