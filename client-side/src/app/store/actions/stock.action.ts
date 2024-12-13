import { createAction, props } from "@ngrx/store";

export const setLoader = createAction(
  '[Stock] set loader',
  props<{ status: boolean }>()
);
