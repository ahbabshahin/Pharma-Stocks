import { AreaCodeApiService } from "../../../service/area-code/area-code-api.service";
import { AreaCodeStoreService } from "../../../service/area-code/area-code-store.service";
import { AreaCodeService } from "../../../service/area-code/area-code.service";

export const providers: any[] = [
  AreaCodeApiService,
  AreaCodeService,
  AreaCodeStoreService,
]
