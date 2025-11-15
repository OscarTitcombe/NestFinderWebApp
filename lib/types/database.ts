export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          phone: string | null
          role: 'buyer' | 'seller' | 'both' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          phone?: string | null
          role?: 'buyer' | 'seller' | 'both' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          phone?: string | null
          role?: 'buyer' | 'seller' | 'both' | null
          created_at?: string
          updated_at?: string
        }
      }
      buyer_requests: {
        Row: {
          id: string
          user_id: string | null
          budget_min: number
          budget_max: number
          beds_min: number
          beds_max: number | null
          property_type: 'flat' | 'house' | 'maisonette' | 'bungalow' | 'other' | 'any'
          postcode_districts: string[]
          description: string
          email: string
          status: 'active' | 'paused' | 'fulfilled' | 'expired'
          created_at: string
          updated_at: string
          expires_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          budget_min: number
          budget_max: number
          beds_min: number
          beds_max?: number | null
          property_type: 'flat' | 'house' | 'maisonette' | 'bungalow' | 'other' | 'any'
          postcode_districts: string[]
          description: string
          email: string
          status?: 'active' | 'paused' | 'fulfilled' | 'expired'
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          budget_min?: number
          budget_max?: number
          beds_min?: number
          beds_max?: number | null
          property_type?: 'flat' | 'house' | 'maisonette' | 'bungalow' | 'other' | 'any'
          postcode_districts?: string[]
          description?: string
          email?: string
          status?: 'active' | 'paused' | 'fulfilled' | 'expired'
          created_at?: string
          updated_at?: string
          expires_at?: string | null
        }
      }
      seller_properties: {
        Row: {
          id: string
          user_id: string
          postcode_district: string
          property_type: 'house' | 'flat' | 'bungalow' | 'any' | 'other'
          expected_price_min: number | null
          expected_price_max: number | null
          bedrooms: number | null
          timeframe: 'immediately' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-browsing' | null
          features: string[] | null
          status: 'active' | 'paused' | 'sold' | 'withdrawn'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          postcode_district: string
          property_type: 'house' | 'flat' | 'bungalow' | 'any' | 'other'
          expected_price_min?: number | null
          expected_price_max?: number | null
          bedrooms?: number | null
          timeframe?: 'immediately' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-browsing' | null
          features?: string[] | null
          status?: 'active' | 'paused' | 'sold' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          postcode_district?: string
          property_type?: 'house' | 'flat' | 'bungalow' | 'any' | 'other'
          expected_price_min?: number | null
          expected_price_max?: number | null
          bedrooms?: number | null
          timeframe?: 'immediately' | '1-3-months' | '3-6-months' | '6-12-months' | 'just-browsing' | null
          features?: string[] | null
          status?: 'active' | 'paused' | 'sold' | 'withdrawn'
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          seller_id: string
          buyer_request_id: string
          seller_email: string
          message: string
          status: 'pending' | 'sent' | 'read' | 'replied'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          seller_id: string
          buyer_request_id: string
          seller_email: string
          message: string
          status?: 'pending' | 'sent' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          seller_id?: string
          buyer_request_id?: string
          seller_email?: string
          message?: string
          status?: 'pending' | 'sent' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}


