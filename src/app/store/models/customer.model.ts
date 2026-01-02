export interface Customer<T> {
  _id?: string;
  name: string;
  contacts: string;
  email?: string;
  img?: string;
  address: string;
  invoices?: string[];
  sn: string;
  areaCode: T;
  customMessage?: string;
}
