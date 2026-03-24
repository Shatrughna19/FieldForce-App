// Purely local sample data. Backend integration removed for now.

export const workerService = {
  getAllWorkers: async () => {
    return {
      data: [
        { id: 'W-01', name: 'Ravi Kumar', status: 'Active', zone: 'Zone A - Connaught Place' },
        { id: 'W-02', name: 'Alok Singh', status: 'In-Progress', zone: 'Zone B - Karol Bagh' },
        { id: 'W-03', name: 'Manish Tiwari', status: 'Inactive', zone: 'Zone C - Lajpat Nagar' },
        { id: 'W-04', name: 'Sunita Patel', status: 'Active', zone: 'Zone D - Paharganj' },
      ]
    };
  },

  getWorkerAnalytics: async (id) => {
    return {
      data: {
        activeDays: 45,
        currentStreak: 5,
        tasksTotal: 12,
        tasksCompleted: 8,
        tasksPending: 4,
        rating: 4.8
      }
    };
  },

  assignTask: async (taskPayload) => {
    console.log("Mock task assignment executed", taskPayload);
    return { status: 201, message: "Task Assigned" };
  },
  
  getGlobalAnalytics: async () => {
    return {
      data: {
        totalWorkers: 145,
        activeNow: 87,
        tasksCompletedToday: 342,
        criticalAlerts: 3
      }
    };
  }
};
