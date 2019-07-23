import { Pipe, PipeTransform } from '@angular/core';
import { AssetDTO, AssetType } from '../../../../libs/api-interface/src';

@Pipe({
  name: 'assetName'
})
export class AssetNamePipe implements PipeTransform {
  transform(value: AssetDTO, args?: any): any {
    switch (value.type) {
      case AssetType.Goalkeeper:
      case AssetType.Defence:
        return value.name;
      default:
        const name = value.name.split(' ');

        if (name.length === 1) {
          return name;
        }

        return (
          name.slice(0, -1).map(n => n[0].toLocaleUpperCase() + '. ') +
          name[name.length - 1]
        );
    }
  }
}
