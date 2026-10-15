import type { VillageContact, WaterScheduleItem, VillageProject } from '../types';
import { api } from '../services/api';

// Sync Village Contacts and Water Schedules directly from PostgreSQL Database
if (typeof window !== 'undefined') {
  api.getVillageContacts().then((res: any) => {
    const list = Array.isArray(res) ? res : (res?.data || []);
    if (list.length > 0) {
      const contacts: VillageContact[] = list.map((c: any) => ({
        id: c.id,
        name: c.name,
        designation: c.designation,
        phone: c.phone,
        category: c.category as any,
        officeHours: c.officeHours || '',
        address: c.address || ''
      }));
      localStorage.setItem('dg_village_contacts', JSON.stringify(contacts));
      window.dispatchEvent(new CustomEvent('dg:contacts-updated', { detail: contacts }));
    }
  }).catch(() => {});

  api.getWaterSchedules().then((res: any) => {
    const list = Array.isArray(res) ? res : (res?.data || []);
    if (list.length > 0) {
      const schedules: WaterScheduleItem[] = list.map((w: any) => ({
        id: w.id,
        ward: w.ward,
        morningTime: w.morningTime,
        eveningTime: w.eveningTime,
        status: w.status as any,
        tankLevelPercent: w.tankLevelPercent || 85,
        notes: w.notes || ''
      }));
      localStorage.setItem('dg_water_schedule', JSON.stringify(schedules));
      window.dispatchEvent(new CustomEvent('dg:water-schedule-updated', { detail: schedules }));
    }
  }).catch(() => {});
}

/**
 * Official Asgaon Gram Panchayat Administrative Directory & Public Utility Schedules
 * All arrays emptied - data is dynamically populated from PostgreSQL database via API
 */

export const VILLAGE_CONTACTS: VillageContact[] = [];

export const WATER_SCHEDULE: WaterScheduleItem[] = [];

export const VILLAGE_PROJECTS: VillageProject[] = [];
