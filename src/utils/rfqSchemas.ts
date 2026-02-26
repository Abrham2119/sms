import { z } from "zod";

export const step1Schema = z.object({
    description: z.string().min(10, "Description must be at least 10 characters"),
    submission_deadline: z.string().refine((date) => {
        const selectedDate = new Date(date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        return selectedDate > today;
    }, "Deadline must be a future date"),
    delivery_terms: z.array(z.object({
        value: z.string().min(1, "Term cannot be empty")
    })).min(1, "At least one delivery term is required"),
    delivery_location: z.string().min(1, "Delivery location is required"),
    for: z.enum(['all', 'local', 'foreign']),
});

export const rfqProductSchema = z.object({
    product_id: z.string().uuid("Invalid product selected"),
    quantity: z.number().int().positive("Quantity must be a positive integer"),
    specifications: z.string().optional(),
});

export const step2Schema = z.object({
    products: z.array(rfqProductSchema).min(1, "At least one product must be added"),
});

export type Step1FormData = z.infer<typeof step1Schema>;
export type Step2FormData = z.infer<typeof step2Schema>;
export type RFQProductFormData = z.infer<typeof rfqProductSchema>;

export const quotationItemSchema = z.object({
    product_id: z.string().uuid(),
    quantity: z.number().positive("Quantity must be positive"),
    unit_price: z.number().positive("Unit price must be positive"),
    discount: z.number().nonnegative().default(0),
    warranty_available: z.boolean().default(false),
    warranty_duration: z.string().optional(),
    warranty_details: z.string().optional(),
});

export const quotationSchema = z.object({
    rfq_id: z.string().uuid(),
    minimum_order_quantity: z.number().min(1, "MOQ must be at least 1"),
    lead_time_days: z.number().min(1, "Lead time must be at least 1 day"),
    proforma_validity_date: z.string().min(1, "Validity date is required"),
    delivery_method: z.string().min(1, "Delivery method is required"),
    warranty_details: z.string().optional(),
    credit_amount: z.number().nonnegative().default(0),
    credit_available: z.boolean(),
    credit_period_days: z.number().min(1, "Credit period is required"),
    availability_status: z.string().min(1, "Availability status is required"),
    additional_terms: z.string().optional(),
    items: z.array(quotationItemSchema).min(1, "At least one item must be included"),
});

export type QuotationFormData = z.infer<typeof quotationSchema>;
export type QuotationItemFormData = z.infer<typeof quotationItemSchema>;
