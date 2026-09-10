export const TOOL_DEFINITIONS = Object.freeze([
  { id: "configdoctor", label: "ConfigDoctor", description: "วิเคราะห์และตรวจสอบการตั้งค่าของโดรน (แนวคิด/พรีวิว)", category: "Config", status: "PREVIEW", icon: "shield", color: "cyan", panel: "placeholder" },
  { id: "obixcore", label: "OBIXCORE", description: "ปรับแต่งและจูนพารามิเตอร์แบบละเอียด (กำลังพัฒนา)", category: "Tuning", status: "COMING SOON", icon: "cpu", color: "violet", panel: "placeholder" },
  { id: "configfpv", label: "ConfigFPV", description: "คลังข้อมูลการตั้งค่าจากชุมชนและโปรไฟล์ด้านล่าง", category: "Config", status: "PREVIEW", icon: "activity", color: "cyan", panel: "placeholder" },
  { id: "configlab", label: "ConfigLab", description: "เครื่องมือทดลองและพัฒนาการตั้งค่าแบบล่าสุด", category: "Data", status: "COMING SOON", icon: "layers", color: "amber", panel: "placeholder" },
  { id: "pidadvisor", label: "PID Advisor", description: "แนะนำค่า PID ที่เหมาะกับสไตล์การบิน", category: "Tuning", status: "READY", icon: "gauge", color: "violet", panel: "pid" },
  { id: "blackbox", label: "Blackbox Analyzer", description: "วิเคราะห์ CSV/text log ภายในเครื่อง (ยังไม่รองรับ binary .bbl)", category: "Analysis", status: "BETA", icon: "radar", color: "cyan", panel: "blackbox" },
  { id: "battery", label: "Battery Analyzer", description: "ติดตามสุขภาพแบตเตอรี่ตามรอบการบิน", category: "Data", status: "BETA", icon: "battery", color: "green", panel: "battery" },
  { id: "vtx", label: "VTX Tools", description: "ตัวช่วยเลือกระดับกำลังส่งตามระยะและสภาพแวดล้อม", category: "Config", status: "BETA", icon: "wifi", color: "amber", panel: "vtx" },
  { id: "motorprop", label: "Motor / Prop Match", description: "ตรวจความเข้ากันได้ของมอเตอร์ ใบพัด และแบตเตอรี่", category: "Config", status: "READY", icon: "gauge", color: "cyan", panel: "motor" },
  { id: "thrustplanner", label: "Weight / Thrust Planner", description: "ตั้งเป้าแรงขับจากน้ำหนักและสไตล์การบิน", category: "Analysis", status: "READY", icon: "activity", color: "green", panel: "thrust" },
]);
