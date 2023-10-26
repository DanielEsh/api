export class Submission {
  id: number;
  number: number;
  area: 'order' | 'callback';
  payment_status: 'paid' | 'card' | 'cash';
  total_price: number;
  comment: string;
  email: string;
  phone: number;
  name: string;
  address: string;
  // id менеджера (может быть null, может меняться)
  // products
}
