export interface ActivityLog {
  user: string;
  name: string;
  action: string;
  when: Date;
  description: string;
}

export interface BarGraph {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  };
}
