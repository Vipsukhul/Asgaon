export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api/v1';

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp?: string;
}

export interface ComplaintPayload {
  title: string;
  description: string;
  category?: string;
  ward?: string;
  citizenName?: string;
  citizenPhone?: string;
  isAnonymous?: boolean;
}

export interface MarketplacePayload {
  titleEn: string;
  titleMr?: string;
  category: string;
  price: number;
  unit?: string;
  descriptionEn?: string;
  descriptionMr?: string;
  imageUrl?: string;
  sellerName: string;
  sellerPhone: string;
  villageName?: string;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('dg_auth_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const isGet = !options.method || options.method.toUpperCase() === 'GET';
  const cacheKey = `dg_cache_${endpoint}`;

  // Emit event if server takes more than 2.5s (e.g. Render free tier cold-start)
  const wakeTimer = setTimeout(() => {
    window.dispatchEvent(new CustomEvent('dg:server-waking', { detail: { endpoint } }));
  }, 2500);

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20s timeout

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
      signal: controller.signal,
    });

    clearTimeout(wakeTimer);
    clearTimeout(timeoutId);
    window.dispatchEvent(new CustomEvent('dg:server-ready'));

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      throw new Error(errorBody.message || `Request failed with status ${response.status}`);
    }

    const json: ApiResponse<T> = await response.json();
    
    // Cache successful GET responses in sessionStorage for instant subsequent loads
    if (isGet && json.data) {
      try {
        sessionStorage.setItem(cacheKey, JSON.stringify(json.data));
      } catch {
        // Ignore storage quota errors
      }
    }

    return json.data;
  } catch (err: any) {
    clearTimeout(wakeTimer);
    clearTimeout(timeoutId);
    window.dispatchEvent(new CustomEvent('dg:server-ready'));

    // If GET request failed or timed out, try falling back to cached response
    if (isGet) {
      const cached = sessionStorage.getItem(cacheKey);
      if (cached) {
        try {
          console.warn(`[API] Network request to ${endpoint} failed (${err.message}). Serving cached data.`);
          return JSON.parse(cached) as T;
        } catch {
          // parse failed, rethrow original error
        }
      }
    }

    throw err;
  }
}


export const api = {
  // Businesses
  getBusinesses: (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (search) params.append('search', search);
    return request<any[]>(`/businesses${params.toString() ? `?${params}` : ''}`);
  },
  createBusiness: (payload: any) => {
    return request<any>('/businesses', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getCategories: () => request<any[]>('/categories'),

  // Jobs
  getJobs: (type?: string) => {
    const params = new URLSearchParams();
    if (type && type !== 'all') params.append('type', type);
    return request<any[]>(`/jobs${params.toString() ? `?${params}` : ''}`);
  },
  createJob: (payload: any) => {
    return request<any>('/jobs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Schemes
  getSchemes: (category?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    return request<any[]>(`/schemes${params.toString() ? `?${params}` : ''}`);
  },

  // Mandi Prices
  getMandiPrices: (market?: string, commodity?: string) => {
    const params = new URLSearchParams();
    if (market) params.append('market', market);
    if (commodity) params.append('commodity', commodity);
    return request<any[]>(`/mandi/prices${params.toString() ? `?${params}` : ''}`);
  },

  // Announcements
  getAnnouncements: (category?: string, urgent?: boolean) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    if (urgent) params.append('urgent', 'true');
    return request<any[]>(`/announcements${params.toString() ? `?${params}` : ''}`);
  },

  // Marketplace
  getMarketplaceListings: (category?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    return request<any[]>(`/marketplace/listings${params.toString() ? `?${params}` : ''}`);
  },
  createMarketplaceListing: (payload: MarketplacePayload) => {
    return request<any>('/marketplace/listings', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Events
  getEvents: (category?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    return request<any[]>(`/events${params.toString() ? `?${params}` : ''}`);
  },
  createEvent: (payload: any) => {
    return request<any>('/events', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateEvent: (id: string, payload: any) => {
    return request<any>(`/events/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteEvent: (id: string) => {
    return request<any>(`/events/${id}`, {
      method: 'DELETE',
    });
  },

  // Blogs & Knowledge Articles
  getBlogs: (category?: string) => {
    const params = new URLSearchParams();
    if (category && category !== 'all') params.append('category', category);
    return request<any[]>(`/blogs${params.toString() ? `?${params}` : ''}`);
  },
  getBlog: (slugOrId: string) => {
    return request<any>(`/blogs/${encodeURIComponent(slugOrId)}`);
  },
  createBlog: (payload: any) => {
    return request<any>('/blogs', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateBlog: (id: string, payload: any) => {
    return request<any>(`/blogs/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteBlog: (id: string) => {
    return request<any>(`/blogs/${id}`, {
      method: 'DELETE',
    });
  },
  likeBlog: (slugOrId: string) => {
    return request<any>(`/blogs/${encodeURIComponent(slugOrId)}/like`, {
      method: 'POST',
    });
  },
  viewBlog: (slugOrId: string) => {
    return request<any>(`/blogs/${encodeURIComponent(slugOrId)}/view`, {
      method: 'POST',
    });
  },
  getBlogComments: (slug: string) => {
    return request<any[]>(`/blogs/${encodeURIComponent(slug)}/comments`);
  },
  addBlogComment: (slug: string, comment: any) => {
    return request<any>(`/blogs/${encodeURIComponent(slug)}/comments`, {
      method: 'POST',
      body: JSON.stringify(comment),
    });
  },

  // Grievance / Complaints
  lodgeComplaint: (payload: ComplaintPayload) => {
    return request<any>('/complaints', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  trackComplaint: (trackingNumber: string) => {
    return request<any>(`/complaints/track/${encodeURIComponent(trackingNumber)}`);
  },
  getAllComplaints: () => {
    return request<any[]>('/complaints');
  },
  getCitizenComplaints: (phone: string) => {
    return request<any[]>(`/complaints/citizen?phone=${encodeURIComponent(phone)}`);
  },

  // Auth
  login: (phone: string, password: string) => {
    return request<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ phone, password }),
    });
  },
  register: (payload: any) => {
    return request<any>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  sendEmailOtp: (email: string) => {
    return request<any>('/auth/email/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  resendEmailOtp: (email: string) => {
    return request<any>('/auth/email/resend-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },
  verifyEmailOtp: (email: string, otp: string, role?: string, fullName?: string) => {
    return request<any>('/auth/email/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp, role, fullName }),
    });
  },
  loginWithGoogle: (payload: { idToken?: string; email?: string; fullName?: string; picture?: string; role?: string }) => {
    return request<any>('/auth/google', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  // Admin Services
  getAdminStats: () => {
    return request<any>('/admin/stats');
  },
  getAdminUsers: () => {
    return request<any[]>('/admin/users');
  },
  updateUserRole: (userId: string, role: string) => {
    return request<any>(`/admin/users/${userId}/role`, {
      method: 'PATCH',
      body: JSON.stringify({ role }),
    });
  },
  updateComplaintStatus: (complaintId: string, status: string, note?: string) => {
    return request<any>(`/admin/complaints/${complaintId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status, note }),
    });
  },
  adminVerifyBusiness: (businessId: string, verified: boolean, badge?: string) => {
    return request<any>(`/admin/businesses/${businessId}/verify`, {
      method: 'PATCH',
      body: JSON.stringify({ verified, badge }),
    });
  },
  adminDeleteBusiness: (businessId: string) => {
    return request<any>(`/admin/businesses/${businessId}`, {
      method: 'DELETE',
    });
  },
  adminDeleteJob: (jobId: string) => {
    return request<any>(`/admin/jobs/${jobId}`, {
      method: 'DELETE',
    });
  },
  createAnnouncement: (payload: { title: string; category?: string; priority?: string; message: string; authorName?: string }) => {
    return request<any>('/announcements', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateAnnouncement: (id: string, payload: { title: string; category?: string; priority?: string; message: string; authorName?: string; isActive?: boolean }) => {
    return request<any>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteAnnouncement: (id: string) => {
    return request<any>(`/announcements/${id}`, {
      method: 'DELETE',
    });
  },

  // Schemes CRUD
  createScheme: (payload: any) => {
    return request<any>('/schemes', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  updateScheme: (id: string, payload: any) => {
    return request<any>(`/schemes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
  },
  deleteScheme: (id: string) => {
    return request<any>(`/schemes/${id}`, {
      method: 'DELETE',
    });
  },

  // Cloudinary Image Upload
  uploadImage: async (file: File, folder: string = 'digitalgaon'): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folder);

    const token = localStorage.getItem('dg_auth_token');
    const headers: Record<string, string> = {};
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/upload/image`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!res.ok) {
      const err = await res.json().catch(() => ({ message: 'Image upload failed' }));
      throw new Error(err.message || 'Image upload failed');
    }

    const json = await res.json();
    return json.data?.url || json.url;
  },
};
