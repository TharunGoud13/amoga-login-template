import { Icons } from "@/components/icons";

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

export type MyDocTemplate = {
  mydoc_id: number;
  status: string;
  created_user_id: string;
  created_user_name: string;
  ref_user_id: null;
  ref_user_name: null;
  created_date: Date;
  updated_date: null;
  data_source_name: null;
  for_business_code: null;
  for_business_name: null;
  for_business_number: null;
  for_user_id: null;
  for_user_name: null;
  business_code: null;
  business_name: string;
  business_number: string;
  doc_name: string;
  doc_code: null;
  doc_description: null;
  tabbed_form: null;
  template: null;
  template_name: null;
  chat_form: null;
  chatform_name: null;
  chatform_url: null;
  app_name: null;
  app_code: null;
  page_name: null;
  database_name: null;
  data_table_name: null;
  data_api_name: null;
  data_api_url: string;
  data_api_key: null;
  doc_entries_table: null;
  doc_entries_table_api: null;
  doc_entries_api: null;
  publish_status: null;
  doc_publish_date: null;
  doc_publish_url: null;
  content: string;
  content_json: null;
  doc_json: DocJSON[];
  visits: null;
  submissions: null;
  shareurl: string;
  shorturl: null;
  chatformshorturl: null;
  form_iframe_code: null;
  chatform_iframe_code: null;
  no_of_tabs: null;
  tab_name: null;
  tab_number: null;
  tab_order: null;
  tab_field_order: null;
  doc_fields_json: null;
  doc_fields_script: null;
  version_no: number;
  version_date: null;
  custom_one: string;
  custom_two: null;
  custom_no_one: null;
  custom_no_two: null;
  mydoc_api: null;
};

export interface DocJSON {
  checked: boolean;
  description: string;
  disabled: boolean;
  label: string;
  name: string;
  placeholder: string;
  required: boolean;
  rowIndex: number;
  type: string;
  value: string;
  variant: string;
  validation_message: string;
  variant_code: string;
}
