import { createAction, props } from "@ngrx/store";
import { AreaCode } from "../models/area-code.model";
import { Update } from "@ngrx/entity";

export const loadAreaCodes = createAction(
  '[Area Code] load area codes',
);
export const loadAreaCodesSuccess = createAction(
  '[Area Code] load area codes success',
  props<{ res: AreaCode[] }>()
);
export const loadAreaCodesFail = createAction(
  '[Area Code] load area codes fail',
  props<{ error: string }>()
);

export const addAreaCode = createAction(
  '[Area Code] add area code',
  props<{ payload: AreaCode }>()
);
export const addAreaCodeSuccess = createAction(
  '[Area Code] add area code success',
  props<{ res: AreaCode }>()
);
export const addAreaCodeFail = createAction(
  '[Area Code] add area code fail',
  props<{ error: string }>()
);

export const updateAreaCode = createAction(
  '[Area Code] update area code',
  props<{ payload: AreaCode }>()
);
export const updateAreaCodeSuccess = createAction(
  '[Area Code] update area code success',
  props<{ res: Update<AreaCode> }>()
);
export const updateAreaCodeFail = createAction(
  '[Area Code] update area code fail',
  props<{ error: string }>()
);

export const deleteAreaCode = createAction(
  '[Area Code] delete area code',
  props<{ id: string }>()
);
export const deleteAreaCodeSuccess = createAction(
  '[Area Code] delete area code success',
  props<{ id: string }>()
);
export const deleteAreaCodeFail = createAction(
  '[Area Code] delete area code fail',
  props<{ error: string }>()
);
