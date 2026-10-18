const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address format'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phoneNumber: z.string().optional(),
  role: z.enum(['customer', 'vendor', 'admin']).default('customer'),
  shopName: z.string().optional(),
  shopDescription: z.string().optional(),
  shopAddress: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

const productSchema = z.object({
  name: z.string().min(3, 'Product name must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  category: z.string().min(2, 'Category is required'),
  tags: z.array(z.string()).optional(),
  originalPrice: z.number().nonnegative().optional(),
  discountPrice: z.number().positive('Discount price must be greater than 0'),
  stock: z.number().int().nonnegative('Stock cannot be negative'),
  images: z.array(z.string()).min(1, 'At least one image URL is required'),
  shopId: z.string().optional(),
});

const orderSchema = z.object({
  cart: z.array(
    z.object({
      productId: z.string(),
      name: z.string(),
      price: z.number(),
      qty: z.number().int().positive(),
      image: z.string().optional(),
      shopId: z.string().optional(),
    })
  ).min(1, 'Cart cannot be empty'),
  shippingAddress: z.object({
    country: z.string().min(1, 'Country is required'),
    city: z.string().min(1, 'City is required'),
    address1: z.string().min(1, 'Address is required'),
    address2: z.string().optional(),
    zipCode: z.string().optional(),
    addressType: z.string().optional(),
  }),
  paymentInfo: z
    .object({
      id: z.string().optional(),
      status: z.string().default('Paid'),
      type: z.string().default('Credit Card'),
    })
    .optional()
    .default({ status: 'Paid', type: 'Credit Card' }),
  totalPrice: z.number().positive('Total price must be greater than 0'),
  couponCode: z.string().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  productSchema,
  orderSchema,
};
