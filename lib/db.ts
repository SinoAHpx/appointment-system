// 定义类型
export type ItemType = {
  type: string;
  quantity: number;
};

export type Appointment = {
  id: string;
  userId: string;
  contactName: string;
  contactPhone: string;
  address: string;
  appointmentTime: string;
  items: ItemType[];
  status: "pending" | "assigned" | "completed" | "cancelled";
  assignedStaff: string | null;
  assignedVehicle: string | null;
  createdAt: string;
};

export type Staff = {
  id: string;
  name: string;
  phone: string;
  available: boolean;
};

export type Vehicle = {
  id: string;
  plate: string;
  type: string;
  available: boolean;
};

// 模拟数据库
const appointments: Appointment[] = [
  {
    id: "1",
    userId: "2",
    contactName: "张三",
    contactPhone: "13800138000",
    address: "北京市朝阳区某某街道123号",
    appointmentTime: "2024-04-20T10:00:00.000Z",
    items: [
      { type: "文件袋", quantity: 5 },
      { type: "硬盘", quantity: 2 },
    ],
    status: "pending", // pending, assigned, completed, cancelled
    assignedStaff: null,
    assignedVehicle: null,
    createdAt: "2024-04-15T08:30:00.000Z",
  },
]

const staff: Staff[] = [
  {
    id: "1",
    name: "李四",
    phone: "13900139000",
    available: true,
  },
  {
    id: "2",
    name: "王五",
    phone: "13700137000",
    available: true,
  },
]

const vehicles: Vehicle[] = [
  {
    id: "1",
    plate: "京A12345",
    type: "小型货车",
    available: true,
  },
  {
    id: "2",
    plate: "京B67890",
    type: "中型货车",
    available: true,
  },
]

// 预约相关操作
export async function createAppointment(data: Partial<Appointment>): Promise<Appointment> {
  const newAppointment: Appointment = {
    id: (appointments.length + 1).toString(),
    status: "pending",
    assignedStaff: null,
    assignedVehicle: null,
    createdAt: new Date().toISOString(),
    userId: "",
    contactName: "",
    contactPhone: "",
    address: "",
    appointmentTime: "",
    items: [],
    ...data,
  }

  appointments.push(newAppointment)
  return newAppointment
}

export async function getAppointments(userId: string | null = null, status: string | null = null): Promise<Appointment[]> {
  let filtered = [...appointments]

  if (userId) {
    filtered = filtered.filter((a) => a.userId === userId)
  }

  if (status) {
    filtered = filtered.filter((a) => a.status === status)
  }

  return filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
}

export async function getAppointmentById(id: string): Promise<Appointment | undefined> {
  return appointments.find((a) => a.id === id)
}

export async function updateAppointment(id: string, data: Partial<Appointment>): Promise<Appointment | null> {
  const index = appointments.findIndex((a) => a.id === id)

  if (index === -1) {
    return null
  }

  appointments[index] = { ...appointments[index], ...data }
  return appointments[index]
}

export async function deleteAppointment(id: string): Promise<boolean> {
  const index = appointments.findIndex((a) => a.id === id)

  if (index === -1) {
    return false
  }

  appointments.splice(index, 1)
  return true
}

// 人员相关操作
export async function getStaff(): Promise<Staff[]> {
  return staff
}

export async function getStaffById(id: string): Promise<Staff | undefined> {
  return staff.find((s) => s.id === id)
}

export async function createStaff(data: Partial<Staff>): Promise<Staff> {
  const newStaff: Staff = {
    id: (staff.length + 1).toString(),
    available: true,
    name: "",
    phone: "",
    ...data,
  }

  staff.push(newStaff)
  return newStaff
}

export async function updateStaff(id: string, data: Partial<Staff>): Promise<Staff | null> {
  const index = staff.findIndex((s) => s.id === id)

  if (index === -1) {
    return null
  }

  staff[index] = { ...staff[index], ...data }
  return staff[index]
}

export async function deleteStaff(id: string): Promise<boolean> {
  const index = staff.findIndex((s) => s.id === id)

  if (index === -1) {
    return false
  }

  staff.splice(index, 1)
  return true
}

// 车辆相关操作
export async function getVehicles(): Promise<Vehicle[]> {
  return vehicles
}

export async function getVehicleById(id: string): Promise<Vehicle | undefined> {
  return vehicles.find((v) => v.id === id)
}

export async function createVehicle(data: Partial<Vehicle>): Promise<Vehicle> {
  const newVehicle: Vehicle = {
    id: (vehicles.length + 1).toString(),
    available: true,
    plate: "",
    type: "",
    ...data,
  }

  vehicles.push(newVehicle)
  return newVehicle
}

export async function updateVehicle(id: string, data: Partial<Vehicle>): Promise<Vehicle | null> {
  const index = vehicles.findIndex((v) => v.id === id)

  if (index === -1) {
    return null
  }

  vehicles[index] = { ...vehicles[index], ...data }
  return vehicles[index]
}

export async function deleteVehicle(id: string): Promise<boolean> {
  const index = vehicles.findIndex((v) => v.id === id)

  if (index === -1) {
    return false
  }

  vehicles.splice(index, 1)
  return true
}

// 分配人员和车辆
export async function assignAppointment(appointmentId: string, staffId: string, vehicleId: string): Promise<{ success: boolean; message?: string }> {
  const appointment = await getAppointmentById(appointmentId)
  const staffMember = await getStaffById(staffId)
  const vehicle = await getVehicleById(vehicleId)

  if (!appointment || !staffMember || !vehicle) {
    return { success: false, message: "找不到预约、人员或车辆" }
  }

  if (!staffMember.available) {
    return { success: false, message: "所选人员不可用" }
  }

  if (!vehicle.available) {
    return { success: false, message: "所选车辆不可用" }
  }

  // 更新预约
  await updateAppointment(appointmentId, {
    status: "assigned",
    assignedStaff: staffId,
    assignedVehicle: vehicleId,
  })

  // 更新人员和车辆状态
  await updateStaff(staffId, { available: false })
  await updateVehicle(vehicleId, { available: false })

  return { success: true }
}

// 完成预约
export async function completeAppointment(appointmentId: string): Promise<{ success: boolean; message?: string }> {
  const appointment = await getAppointmentById(appointmentId)

  if (!appointment) {
    return { success: false, message: "找不到预约" }
  }

  if (appointment.status !== "assigned") {
    return { success: false, message: "预约状态不正确" }
  }

  // 更新预约
  await updateAppointment(appointmentId, {
    status: "completed",
  })

  // 释放人员和车辆
  if (appointment.assignedStaff) {
    await updateStaff(appointment.assignedStaff, { available: true })
  }

  if (appointment.assignedVehicle) {
    await updateVehicle(appointment.assignedVehicle, { available: true })
  }

  return { success: true }
}

// 导出数据
export async function exportData(type: 'appointments' | 'staff' | 'vehicles'): Promise<string> {
  const data = type === 'appointments' 
    ? appointments 
    : type === 'staff' 
      ? staff 
      : vehicles;
  
  return JSON.stringify(data, null, 2);
}
