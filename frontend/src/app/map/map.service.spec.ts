import * as L from 'leaflet';
import { environment } from 'src/environments/environment';
import { MapService } from './map.service';

describe('MapService tile theme', () => {
  it('redraws the existing layer with the configured dark and light URLs', () => {
    const service = new MapService();
    const tiles = L.tileLayer(environment.map.tiles.default);
    const setUrl = spyOn(tiles, 'setUrl').and.callThrough();

    service.updateTileTheme(tiles, true);
    expect(setUrl).toHaveBeenCalledWith(environment.map.tiles.dark);
    service.updateTileTheme(tiles, false);
    expect(setUrl).toHaveBeenCalledWith(environment.map.tiles.default);
    expect(setUrl).toHaveBeenCalledTimes(2);
  });
});
