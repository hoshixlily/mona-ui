export type SelectableOptions =
    | {
          enabled?: boolean;
          mode: "single";
          toggleable?: boolean;
      }
    | {
          enabled?: boolean;
          mode: "multiple";
      };
