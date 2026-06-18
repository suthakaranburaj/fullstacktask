declare module 'react-quill' {
  import type { ComponentType } from 'react';

  interface ReactQuillProps {
    theme?: string;
    value?: string;
    onChange?: (value: string) => void;
    modules?: Record<string, unknown>;
    placeholder?: string;
    readOnly?: boolean;
  }

  const ReactQuill: ComponentType<ReactQuillProps>;
  export default ReactQuill;
}
