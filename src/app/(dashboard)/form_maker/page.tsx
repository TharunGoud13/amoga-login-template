// import FormBuilder from '@/components/form-builder-2/FormBuilder'
import dynamic from "next/dynamic";

const FormBuilder = dynamic(
  () => import("@/components/form-builder-2/FormBuilder")
);
export default function TestPage() {
  return <FormBuilder />;
}
