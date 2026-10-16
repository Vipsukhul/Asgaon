import { useState, useEffect, useCallback } from 'react';
import { useToast } from '../context/ToastContext';
import { useLanguage } from '../context/LanguageContext';

export interface BookmarkedItem {
  id: string;
  title: string;
  type: 'scheme' | 'business' | 'job' | 'announcement';
  dateAdded: string;
}

const STORAGE_KEY_BOOKMARKS = 'dg_asgaon_optimistic_bookmarks';
const STORAGE_KEY_APPLIED_JOBS = 'dg_asgaon_applied_jobs';

export function useOptimisticBookmarks() {
  const toast = useToast();
  const { lang } = useLanguage();
  const isMr = lang === 'MR';

  const [bookmarks, setBookmarks] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  const [appliedJobs, setAppliedJobs] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_APPLIED_JOBS);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync to storage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
    } catch (e) {
      console.warn('Failed to sync bookmarks to localStorage', e);
    }
  }, [bookmarks]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_APPLIED_JOBS, JSON.stringify(appliedJobs));
    } catch (e) {
      console.warn('Failed to sync applied jobs to localStorage', e);
    }
  }, [appliedJobs]);

  const isBookmarked = useCallback((id: string | number) => {
    return Boolean(bookmarks[String(id)]);
  }, [bookmarks]);

  const toggleBookmark = useCallback((item: { id: string | number; title?: string; name?: string }) => {
    const key = String(item.id);
    const itemLabel = item.title || item.name || 'घटक';
    const willBeSaved = !bookmarks[key];

    // 1. Optimistic instant update
    setBookmarks((prev) => {
      const next = { ...prev };
      if (willBeSaved) {
        next[key] = true;
      } else {
        delete next[key];
      }
      return next;
    });

    // 2. Immediate modern toast feedback
    if (willBeSaved) {
      toast.success(
        isMr ? `"${itemLabel}" तुमच्या प्रोफाईलमध्ये जतन केले!` : `"${itemLabel}" saved to your bookmarks!`,
        isMr ? 'यशस्वीरीत्या जतन केले' : 'Bookmarked'
      );
    } else {
      toast.info(
        isMr ? `"${itemLabel}" जतन केलेल्या यादीतून काढून टाकले.` : `"${itemLabel}" removed from bookmarks.`,
        isMr ? 'काढून टाकले' : 'Removed'
      );
    }

    return willBeSaved;
  }, [bookmarks, isMr, toast]);

  const hasApplied = useCallback((jobId: string | number) => {
    return Boolean(appliedJobs[String(jobId)]);
  }, [appliedJobs]);

  const applyJobOptimistic = useCallback((job: { id: string | number; title: string; employerName?: string }, onConfirmed?: () => void) => {
    const key = String(job.id);
    if (appliedJobs[key]) {
      toast.info(
        isMr ? 'तुम्ही या नोकरीसाठी आधीच अर्ज सादर केला आहे.' : 'You have already applied for this job vacancy.',
        isMr ? 'माहिती' : 'Notice'
      );
      return;
    }

    // 1. Instant optimistic state bump
    setAppliedJobs((prev) => ({ ...prev, [key]: true }));

    // 2. High-speed feedback toast
    toast.success(
      isMr
        ? `"${job.title}" पदासाठी अर्ज सादर झाला! ${job.employerName ? `(${job.employerName})` : ''}`
        : `Application submitted for "${job.title}"! ${job.employerName ? `(${job.employerName})` : ''}`,
      isMr ? 'अर्ज यशस्वी' : 'Application Sent'
    );

    if (onConfirmed) {
      onConfirmed();
    }
  }, [appliedJobs, isMr, toast]);

  return {
    bookmarks,
    isBookmarked,
    toggleBookmark,
    appliedJobs,
    hasApplied,
    applyJobOptimistic
  };
}
