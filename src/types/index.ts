import { Icons } from '@/components/icons';
import * as Locales from 'date-fns/locale'


export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;

export type FormFieldType = {
  type: string
  variant: string
  name: string
  variant_code?: string
  validation_message?: string
  label: string
  placeholder?: string
  description?: string
  options?: string[]
  combobox?: string[]
  multiselect?: string[]
  radiogroup?: string[]
  placeholder_file_url?: string
  placeholder_video_url?: string
  placeholder_file_upload_url?: string
  placeholder_pdf_file_url?: string
  disabled: boolean
  value: string | boolean | Date | number | string[]
  setValue: (value: string | boolean) => void
  checked: boolean
  onChange: (
    value: string | string[] | boolean | Date | number | number[],
  ) => void
  onSelect: (
    value: string | string[] | boolean | Date | number | number[],
  ) => void
  rowIndex: number
  required?: boolean
  min?: number
  max?: number
  step?: number
  locale?: keyof typeof Locales
  hour12?: boolean
  className?: string
}

export type FieldType = { name: string; isNew: boolean; index?: number }

