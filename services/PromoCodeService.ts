import { PromoCode, CreatePromoCodeDto, UpdatePromoCodeDto } from '../models';

export class PromoCodeService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<PromoCode[]> {
    const response = await fetch(`${this.baseUrl}/promo-codes`);
    if (!response.ok) {
      throw new Error('Failed to fetch promo codes');
    }
    return response.json();
  }

  async getById(id: number): Promise<PromoCode> {
    const response = await fetch(`${this.baseUrl}/promo-codes/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch promo code with id ${id}`);
    }
    return response.json();
  }

  async getByCode(code: string): Promise<PromoCode> {
    const response = await fetch(`${this.baseUrl}/promo-codes/code/${code}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch promo code with code ${code}`);
    }
    return response.json();
  }

  async getActive(): Promise<PromoCode[]> {
    const response = await fetch(`${this.baseUrl}/promo-codes/active`);
    if (!response.ok) {
      throw new Error('Failed to fetch active promo codes');
    }
    return response.json();
  }

  async create(data: CreatePromoCodeDto): Promise<PromoCode> {
    const response = await fetch(`${this.baseUrl}/promo-codes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create promo code');
    }
    return response.json();
  }

  async update(id: number, data: UpdatePromoCodeDto): Promise<PromoCode> {
    const response = await fetch(`${this.baseUrl}/promo-codes/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update promo code with id ${id}`);
    }
    return response.json();
  }

  async validateCode(code: string): Promise<{ valid: boolean; promoCode?: PromoCode }> {
    const response = await fetch(`${this.baseUrl}/promo-codes/validate/${code}`);
    if (!response.ok) {
      throw new Error(`Failed to validate promo code ${code}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/promo-codes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete promo code with id ${id}`);
    }
  }
}

