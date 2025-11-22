import { DiscountType } from './enums';

export interface PromoCode {
  id: number;
  active: boolean;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiresAt: Date;
  maxUses: number;
  useCount: number;
}

export interface CreatePromoCodeDto {
  active: boolean;
  code: string;
  discountType: DiscountType;
  discountValue: number;
  expiresAt: Date;
  maxUses: number;
}

export interface UpdatePromoCodeDto {
  active?: boolean;
  discountType?: DiscountType;
  discountValue?: number;
  expiresAt?: Date;
  maxUses?: number;
  useCount?: number;
}

