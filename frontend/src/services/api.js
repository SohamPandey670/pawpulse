import axios from 'axios';
import * as synthetic from '../data/syntheticData';

// If VITE_API_URL is configured, use it (with /api suffix). Otherwise, default to synthetic mode
const rawApiUrl = import.meta.env.VITE_API_URL || null;
export const API_BASE_URL = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`)
  : null;

export const isLiveBackend = Boolean(API_BASE_URL);

const api = API_BASE_URL
  ? axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    })
  : null;

// Attach JWT token to requests if live backend is enabled
if (api) {
  api.interceptors.request.use((config) => {
    try {
      const saved = localStorage.getItem('pawpulse_user');
      if (saved) {
        const user = JSON.parse(saved);
        if (user.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch {
      // ignore JSON parse error
    }
    return config;
  });
}

// Service layer with instant synthetic data and graceful fallback
export const DashboardService = {
  getKpiSummary: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/kpis');
        return response.data;
      } catch {
        return synthetic.kpiData;
      }
    }
    return synthetic.kpiData;
  },
  getDailyConsultations: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/daily-consultations');
        return response.data;
      } catch {
        return synthetic.dailyConsultations;
      }
    }
    return synthetic.dailyConsultations;
  },
  getServiceTypeDistribution: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/service-types');
        return response.data;
      } catch {
        return synthetic.byServiceType;
      }
    }
    return synthetic.byServiceType;
  },
  getSpeciesMix: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/species-mix');
        return response.data;
      } catch {
        return synthetic.speciesMix;
      }
    }
    return synthetic.speciesMix;
  },
  getReferralTatByClinic: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/referral-tat');
        return response.data;
      } catch {
        return synthetic.referralTatByClinic;
      }
    }
    return synthetic.referralTatByClinic;
  },
  getRxComplianceTrends: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/rx-compliance');
        return response.data;
      } catch {
        return synthetic.rxComplianceByWeek;
      }
    }
    return synthetic.rxComplianceByWeek;
  },
  getTopPerformingVets: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/top-vets');
        return response.data;
      } catch {
        return synthetic.topPerformingVets;
      }
    }
    return synthetic.topPerformingVets;
  },
  getBestPerformingClinics: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/top-clinics');
        return response.data;
      } catch {
        return synthetic.bestPerformingClinics;
      }
    }
    return synthetic.bestPerformingClinics;
  },
  getPetParentsByLocation: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/location-mix');
        return response.data;
      } catch {
        return synthetic.petParentsByLocation;
      }
    }
    return synthetic.petParentsByLocation;
  },
  getMostSoldServices: async () => {
    if (api) {
      try {
        const response = await api.get('/dashboard/most-sold');
        return response.data;
      } catch {
        return synthetic.mostSoldServices;
      }
    }
    return synthetic.mostSoldServices;
  },
};

export const AppointmentService = {
  getAll: async () => {
    if (api) {
      try {
        const response = await api.get('/appointments');
        return response.data;
      } catch {
        return synthetic.sampleAppointments;
      }
    }
    return synthetic.sampleAppointments;
  },
  create: async (appointment) => {
    if (api) {
      try {
        const response = await api.post('/appointments', appointment);
        return response.data;
      } catch {
        // Fallback to local
      }
    }
    const newAppt = {
      ...appointment,
      id: `appt-${Date.now()}`,
      status: 'booked',
      notes: appointment.notes || '',
    };
    return newAppt;
  },
  updateStatus: async (id, status) => {
    if (api) {
      try {
        const response = await api.patch(`/appointments/${id}/status`, { status });
        return response.data;
      } catch {
        // Fallback to local
      }
    }
    return { id, status, updated: true };
  },
};

export const ReferralService = {
  getAll: async () => {
    if (api) {
      try {
        const response = await api.get('/referrals');
        return response.data;
      } catch {
        return synthetic.sampleReferrals;
      }
    }
    return synthetic.sampleReferrals;
  },
  updateStatus: async (id, status) => {
    if (api) {
      try {
        const response = await api.patch(`/referrals/${id}/status`, { status });
        return response.data;
      } catch {
        // Fallback
      }
    }
    return { id, status, updated: true };
  },
};

export const PetService = {
  getAll: async () => {
    if (api) {
      try {
        const response = await api.get('/pets');
        return response.data;
      } catch {
        return synthetic.samplePets;
      }
    }
    return synthetic.samplePets;
  },
  create: async (pet) => {
    if (api) {
      try {
        const response = await api.post('/pets', pet);
        return response.data;
      } catch {
        // Fallback
      }
    }
    return { ...pet, id: `pet-${Date.now()}` };
  },
};

export const PrescriptionService = {
  getAll: async () => {
    if (api) {
      try {
        const response = await api.get('/prescriptions');
        return response.data;
      } catch {
        return synthetic.samplePrescriptions;
      }
    }
    return synthetic.samplePrescriptions;
  },
  create: async (prescription) => {
    if (api) {
      try {
        const response = await api.post('/prescriptions', prescription);
        return response.data;
      } catch {
        // Fallback
      }
    }
    return { ...prescription, id: `rx-${Date.now()}`, uploaded: true };
  },
};

export default api;
