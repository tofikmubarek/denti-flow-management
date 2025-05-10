
import { supabase } from '@/integrations/supabase/client';

export interface Contact {
  id?: string;
  created_at?: string;
  updated_at?: string;
  name: string;
  email?: string;
  phone?: string;
  company?: string;
  position?: string;
  type?: string;
  notes?: string;
  status?: string;
  last_contact_date?: string;
}

export interface Address {
  id?: string;
  contact_id: string;
  address_type: string;
  street?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  is_primary: boolean;
}

export interface Tag {
  id?: string;
  name: string;
  color?: string;
}

export interface ContactTag {
  id?: string;
  contact_id: string;
  tag_id: string;
}

// Create SQL helpers that the user can run in the Supabase SQL editor
export const createTableSQL = `
-- Create contacts table
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  company TEXT,
  position TEXT,
  type TEXT,
  notes TEXT,
  status TEXT DEFAULT 'active',
  last_contact_date TIMESTAMP WITH TIME ZONE
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  address_type TEXT DEFAULT 'main',
  street TEXT,
  city TEXT,
  state TEXT,
  postal_code TEXT,
  country TEXT,
  is_primary BOOLEAN DEFAULT false
);

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  color TEXT
);

-- Create contact_tags join table
CREATE TABLE IF NOT EXISTS contact_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_id UUID REFERENCES contacts(id) ON DELETE CASCADE,
  tag_id UUID REFERENCES tags(id) ON DELETE CASCADE,
  UNIQUE (contact_id, tag_id)
);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Set up triggers for updated_at
CREATE TRIGGER set_updated_at
BEFORE UPDATE ON contacts
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
`;

// Contact CRUD operations - All these functions are now wrapped in try/catch blocks
// to properly handle errors from the mock client when Supabase isn't configured

export const getContacts = async () => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data as Contact[];
  } catch (error: any) {
    console.error('Error getting contacts:', error);
    throw error;
  }
};

export const getContactById = async (id: string) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        addresses(*),
        contact_tags(
          id,
          tags(*)
        )
      `)
      .eq('id', id)
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error getting contact with ID ${id}:`, error);
    throw error;
  }
};

export const createContact = async (contact: Contact) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .insert(contact)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error('Error creating contact:', error);
    throw error;
  }
};

export const updateContact = async (id: string, contact: Contact) => {
  try {
    const { data, error } = await supabase
      .from('contacts')
      .update(contact)
      .eq('id', id)
      .select()
      .single();
      
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error(`Error updating contact with ID ${id}:`, error);
    throw error;
  }
};

export const deleteContact = async (id: string) => {
  try {
    const { error } = await supabase
      .from('contacts')
      .delete()
      .eq('id', id);
      
    if (error) throw error;
    return true;
  } catch (error: any) {
    console.error(`Error deleting contact with ID ${id}:`, error);
    throw error;
  }
};

// Address operations
export const createAddress = async (address: Address) => {
  try {
    const { data, error } = await supabase
      .from('addresses')
      .insert(address)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error('Error creating address:', error);
    throw error;
  }
};

// Tag operations
export const getTags = async () => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
      
    if (error) throw error;
    return data as Tag[];
  } catch (error: any) {
    console.error('Error getting tags:', error);
    throw error;
  }
};

export const createTag = async (tag: Tag) => {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert(tag)
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error('Error creating tag:', error);
    throw error;
  }
};

// Contact tag operations
export const addTagToContact = async (contactId: string, tagId: string) => {
  try {
    const { data, error } = await supabase
      .from('contact_tags')
      .insert({ contact_id: contactId, tag_id: tagId })
      .select();
      
    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error(`Error adding tag ${tagId} to contact ${contactId}:`, error);
    throw error;
  }
};
