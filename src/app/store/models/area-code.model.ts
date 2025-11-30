export interface AreaCodeRequiredFields {
  areaName: string;
  areaCode: string;
  areaManager: string | AreaManager;
}

export interface AreaCode extends AreaCodeRequiredFields {
  _id?: string;
  areaMarketingSpending?: number;
  color?: string;
  description?: string;
}

export interface AreaManager {
  "_id": "678fd35afa130a442432fe5d",
  "username": "ahbabshahin",
  "email": "ahbabshahin7788@gmail.com"
}

