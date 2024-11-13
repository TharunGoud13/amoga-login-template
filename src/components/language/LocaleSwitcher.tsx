import { useLocale, useTranslations } from "next-intl";
import LocaleSwitcherSelect from "./LocaleSwitcherSelector";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();

  return (
    <LocaleSwitcherSelect
      defaultValue={locale}
      items={[
        {
          value: "en",
          label: t("en"),
        },
        {
          value: "de",
          label: t("de"),
        },
        {
            value: "fr",
            label: t("fr"),
          },
          {
            value: "me",
            label: t("me"),
          },

        {
          value: "te",
          label: t("te"),
        },
        {
          value: "hi",
          label: t("hi"),
        },
      ]}
      label={t("label")}
    />
  );
}
