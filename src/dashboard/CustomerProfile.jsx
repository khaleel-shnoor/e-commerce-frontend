import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, Loader2, Mail, Phone, User as UserIcon } from 'lucide-react';
import { PageWrapper } from '../components/common/PageWrapper';
import { UserAvatar } from '../components/common/UserAvatar';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { profileApi } from '../lib/api';

export default function CustomerProfile() {
  const { user, applyUser } = useAuth();
  const { addToast } = useToast();
  const fileRef = useRef(null);

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ full_name: '', phone: '' });

  const loadProfile = useCallback(async () => {
    setLoading(true);
    try {
      const data = await profileApi.get();
      setProfile(data);
      setForm({
        full_name: data.full_name || '',
        phone: data.phone || '',
      });
      applyUser(data);
    } catch (err) {
      addToast(err.message || 'Failed to load profile', 'error');
    } finally {
      setLoading(false);
    }
  }, [addToast, applyUser]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await profileApi.update({
        full_name: form.full_name,
        phone: form.phone,
      });
      setProfile(updated);
      applyUser(updated);
      addToast('Profile updated', 'success');
    } catch (err) {
      addToast(err.message || 'Update failed', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const updated = await profileApi.uploadAvatar(file);
      setProfile(updated);
      applyUser(updated);
      addToast('Profile photo updated', 'success');
    } catch (err) {
      addToast(err.message || 'Upload failed', 'error');
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  const display = profile || user;

  return (
    <PageWrapper title="Profile" loading={loading}>
      <div className="max-w-2xl space-y-8">
        <section className="rounded-xl border border-border bg-card p-6 flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <UserAvatar
              src={display?.avatar_url}
              name={display?.full_name || display?.email}
              className="h-24 w-24"
              iconClassName="h-10 w-10"
            />
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center border-2 border-card hover:opacity-90 disabled:opacity-50"
              aria-label="Change profile photo"
            >
              {uploading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>
          <div className="text-center sm:text-left flex-1 min-w-0">
            <h2 className="text-xl font-heading tracking-wide truncate">
              {display?.full_name || 'Your profile'}
            </h2>
            <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
              <Mail className="h-3.5 w-3.5 shrink-0" />
              {display?.email}
            </p>
            {display?.phone && (
              <p className="text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5 mt-1">
                <Phone className="h-3.5 w-3.5 shrink-0" />
                {display.phone}
              </p>
            )}
            {!display?.avatar_url && (
              <p className="text-xs text-muted-foreground mt-3">
                No photo yet — tap the camera icon to upload (Cloudinary).
              </p>
            )}
          </div>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h3 className="font-heading text-lg tracking-wide mb-6 flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Personal details
          </h3>
          <form className="space-y-4" onSubmit={handleSave}>
            <Input
              label="Full name"
              name="full_name"
              value={form.full_name}
              onChange={(e) => setForm((f) => ({ ...f, full_name: e.target.value }))}
              placeholder="Alex Morgan"
            />
            <Input
              label="Phone"
              name="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
              placeholder="+1 555 000 0000"
            />
            <Input label="Email" value={display?.email || ''} disabled />
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving…' : 'Save changes'}
            </Button>
          </form>
        </section>
      </div>
    </PageWrapper>
  );
}
