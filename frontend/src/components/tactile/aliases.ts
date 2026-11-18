/**
 * Alias API du kit neumorphique → composants factorisés (renames uniquement).
 * Les exports homonymes (Accordion, Card…) restent sur `./index`.
 */

export { SpectrumKnob as Potentiometer } from './audio/SpectrumKnob'
export type { SpectrumKnobProps as PotentiometerProps } from './audio/SpectrumKnob'

export { VuMeter as VUMeter, VuMeter as UvMeter } from './audio/VuMeter'

export { AudioLevelMeter as AudioLevelIndicator } from './audio/AudioLevelMeter'
export type { AudioLevelMeterProps as AudioLevelIndicatorProps } from './audio/AudioLevelMeter'

export { PillButton as Button } from './forms/PillButton'
export type { PillButtonProps as ButtonProps } from './forms/PillButton'

export { TextField as Input, PasswordField as Password, SearchField as Search } from './forms/TextField'
export type {
  TextFieldProps as InputProps,
  PasswordFieldProps as PasswordProps,
  SearchFieldProps as SearchProps,
} from './forms/TextField'

export {
  CheckboxField as Checkbox,
  RadioGroup as Radio,
  ToggleSwitch as Toggle,
} from './forms/Choice'
export type {
  CheckboxFieldProps as CheckboxProps,
  RadioGroupProps as RadioProps,
  ToggleSwitchProps as ToggleProps,
} from './forms/Choice'

export { RangeField as Range } from './forms/RangeField'
export type { RangeFieldProps as RangeProps } from './forms/RangeField'

export { SegmentedPills as Segmented } from './primitives'
export type { SegmentedPillsProps as SegmentedProps } from './primitives'

export { SelectField as Select, ComboboxField as Combobox } from './forms/SelectField'
export type {
  SelectFieldProps as SelectProps,
  ComboboxFieldProps as ComboboxProps,
} from './forms/SelectField'

export { FileDropzone as Upload } from './forms/FileDropzone'
export type { FileDropzoneProps as UploadProps } from './forms/FileDropzone'

export { ContactForm as Form } from './forms/ContactForm'
export type { ContactFormProps as FormProps } from './forms/ContactForm'

export { TabBar as Tab, TabBar as Navigation, TabBar as Tabnav } from './navigation'
export type { TabBarProps as TabProps, TabItem as NavItem } from './navigation'

export { Breadcrumbs as Breadcrumb } from './navigation'
export { SideNavigation as Sidemenu } from './navigation'
export { SkipLinks as Skiplink } from './navigation'
export { PageOutline as Summary } from './navigation'

export { AppHeader as Header } from './shell/AppHeader'
export { LanguageMenu as Translate } from './forms/SelectField'

export { NoticeBanner as Notice } from './feedback'
export { StatHighlight as Highlight } from './feedback'
export { ConfirmDialog as Modal } from './feedback'
export { ConsentBanner as Consent } from './feedback'

export { QuoteBlock as Quote } from './content'
export { MediaPlayer as Content } from './content'
export { DataTable as Table } from './content'
export { Transcript as Transcription } from './content'
export { BrandLogo as Logo } from './content'

export { DisplaySettings as Display } from './actions'
export { DownloadCard as Download } from './forms/FileDropzone'
export { ActionMenu as Dropdown } from './actions'
export { NewsletterSignup as Follow } from './actions'
export { TextLink as Link } from './actions'
export { ShareMenu as Share } from './actions'
export { SiteFooter as Footer } from './actions'
