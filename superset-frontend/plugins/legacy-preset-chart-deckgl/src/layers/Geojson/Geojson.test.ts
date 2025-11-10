/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
import { SqlaFormData } from '@superset-ui/core';
import {
  computeJavaScriptDeckglIconOptions,
  computeJavaScriptDeckglTextOptions,
  computeBasicDeckglIconOptions,
  computeBasicDeckglTextOptions,
} from './Geojson';

jest.mock('@deck.gl/react', () => ({
  __esModule: true,
  default: () => null,
}));

describe('computeJavaScriptDeckglTextOptions', () => {
  it('should return an empty object for non-object input', () => {
    expect(computeJavaScriptDeckglTextOptions(null)).toEqual({});
    expect(computeJavaScriptDeckglTextOptions(42)).toEqual({});
    expect(computeJavaScriptDeckglTextOptions('string')).toEqual({});
  });

  it('should extract valid text options from the input object', () => {
    const input = {
      getText: 'name',
      getTextColor: [1, 2, 3],
      invalidOption: true,
    };
    const expectedOutput = {
      getText: 'name',
      getTextColor: [1, 2, 3],
    };
    expect(computeJavaScriptDeckglTextOptions(input)).toEqual(expectedOutput);
  });
});

describe('computeJavaScriptDeckglIconOptions', () => {
  it('should return an empty object for non-object input', () => {
    expect(computeJavaScriptDeckglIconOptions(null)).toEqual({});
    expect(computeJavaScriptDeckglIconOptions(42)).toEqual({});
    expect(computeJavaScriptDeckglIconOptions('string')).toEqual({});
  });

  it('should extract valid icon options from the input object', () => {
    const input = {
      getIcon: 'icon_name',
      getIconColor: [1, 2, 3],
      invalidOption: false,
    };
    const expectedOutput = {
      getIcon: 'icon_name',
      getIconColor: [1, 2, 3],
    };
    expect(computeJavaScriptDeckglIconOptions(input)).toEqual(expectedOutput);
  });
});

describe('computeBasicDeckglTextOptions', () => {
  it('should compute text options based on form data', () => {
    const formData: SqlaFormData = {
      label_property_name: 'name',
      label_color: { r: 1, g: 2, b: 3, a: 1 },
      label_size: 123,
      label_size_unit: 'pixels',
      datasource: 'test_datasource',
      viz_type: 'deck_geojson',
    };

    const expectedOutput = {
      getText: expect.any(Function),
      getTextColor: [1, 2, 3, 255],
      getTextSize: 123,
      textSizeUnits: 'pixels',
    };

    const actualOutput = computeBasicDeckglTextOptions(formData);
    expect(actualOutput).toEqual(expectedOutput);

    const sampleFeature = { properties: { name: 'Test' } };
    expect(actualOutput.getText(sampleFeature)).toBe('Test');
  });
});

describe('computeBasicDeckglIconOptions', () => {
  it('should compute icon options based on form data', () => {
    const formData: SqlaFormData = {
      icon_url: 'https://example.com/icon.png',
      icon_height: 101,
      icon_width: 102,
      icon_size: 103,
      icon_size_unit: 'pixels',
      datasource: 'test_datasource',
      viz_type: 'deck_geojson',
    };

    const expectedOutput = {
      getIcon: expect.any(Function),
      getIconSize: 103,
      iconSizeUnits: 'pixels',
    };

    const actualOutput = computeBasicDeckglIconOptions(formData);
    expect(actualOutput).toEqual(expectedOutput);
    expect(actualOutput.getIcon()).toEqual({
      url: 'https://example.com/icon.png',
      height: 101,
      width: 102,
    });
  });
});
