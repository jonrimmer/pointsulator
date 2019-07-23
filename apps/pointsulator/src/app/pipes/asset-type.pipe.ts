import { Pipe, PipeTransform } from '@angular/core';
import { AssetDTO, AssetType } from '../../../../../libs/api-interface/src';

@Pipe({
  name: 'assetType'
})
export class AssetTypePipe implements PipeTransform {
  transform(value: AssetType, args?: any): any {
    switch (value) {
      case AssetType.Goalkeeper:
        return 'GK';
      case AssetType.Defence:
        return 'DF';
      case AssetType.Midfielder:
        return 'MF';
      case AssetType.Forward:
        return 'FW';
    }
  }
}
