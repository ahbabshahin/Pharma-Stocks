export interface ActivityLog {
  user: string;
  name: string;
  action: string;
  when: Date;
  description: string;
}

export interface BarGraph {
  labels: string[];
  indexAxis: string;
  datasets: {
    label: string;
    data: number[];
  };
}
export interface LineGraph {
  labels: string[];
  xTitle: string;
  yTitle: string;
  datasets: {
    label: string;
    data: number[];
  };
}
