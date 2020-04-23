export interface Message {
  ts: number;
  user: string;
  msg: string;
  type?: 'SYSTEM' | 'MSG';
  img?: string;
}

