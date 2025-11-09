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
import { ControlPanelConfig } from '@superset-ui/chart-controls';
import { t, legacyValidateInteger } from '@superset-ui/core';
import { formatSelectOptions } from '../../utilities/utils';
import {
  filterNulls,
  jsColumns,
  jsDataMutator,
  jsTooltip,
  jsOnclickHref,
  jsFunctionControl,
  fillColorPicker,
  strokeColorPicker,
  filled,
  stroked,
  extruded,
  viewport,
  mapboxStyle,
  autozoom,
  lineWidth,
  tooltipContents,
  tooltipTemplate,
} from '../../utilities/Shared_DeckGL';
import { dndGeojsonColumn } from '../../utilities/sharedDndControls';
import { BLACK_COLOR } from '../../utilities/controls';

const defaultLabelConfigGenerator = `() => ({
  // Check the documentation at https://deck.gl/docs/api-reference/layers/geojson-layer#pointtype-options-2
  getText: f => f.properties.name,
  getTextColor: [0, 0, 0, 255],
  getTextSize: 24,
  textSizeUnits: 'pixels', 
})`;

const defaultIconConfigGenerator = `() => ({
  // Check the documentation at https://deck.gl/docs/api-reference/layers/geojson-layer#pointtype-options-1
   getIcon: () => ({ url: 'https://static.thenounproject.com/png/888711-200.png', height: 128, width: 128 }),
  getIconSize: 60,
  IconSizeUnits: 'pixels',
})`;

const config: ControlPanelConfig = {
  controlPanelSections: [
    {
      label: t('Query'),
      expanded: true,
      controlSetRows: [
        [dndGeojsonColumn],
        ['row_limit'],
        [filterNulls],
        ['adhoc_filters'],
        [tooltipContents],
        [tooltipTemplate],
      ],
    },
    {
      label: t('Map'),
      controlSetRows: [[mapboxStyle, viewport], [autozoom]],
    },
    {
      label: t('GeoJson Settings'),
      controlSetRows: [
        [fillColorPicker, strokeColorPicker],
        [filled, stroked],
        [extruded],
        [
          {
            name: 'enable_labels',
            config: {
              type: 'CheckboxControl',
              label: t('Enable Labels'),
              description: t('TODO'),
              default: false,
            },
          }
        ],
        [
          {
            name: 'enable_label_javascript_mode',
            config: {
              type: 'CheckboxControl',
              label: t('Enable Label JavaScript Mode'),
              description: t('TODO'),
              visibility: ({ form_data }) => !!form_data.enable_labels,
              default: false,
            },
          }
        ],
        [
          {
            name: 'label_property_name',
            config: {
              type: 'TextControl',
              label: t('Label Property Name'),
              description: t('TODO'),
              visibility: ({ form_data }) => !!form_data.enable_labels && !form_data.enable_label_javascript_mode,
              default: 'name',
            },
          }
        ],
        [
          {
            name: 'label_color',
            config: {
              type: 'ColorPickerControl',
              label: t('Label Color'),
              description: t('TODO'),
              visibility: ({ form_data }) => !!form_data.enable_labels && !form_data.enable_label_javascript_mode,
              default: BLACK_COLOR,
            },
          }
        ],
        [
          {
            name: 'label_size',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Label Size'),
              description: t('TODO'),
              visibility: ({ form_data }) => !!form_data.enable_labels && !form_data.enable_label_javascript_mode,
              validators: [legacyValidateInteger],
              choices: formatSelectOptions([8, 16, 24, 32, 64, 128]),
              default: 24,
            },
          }
        ],
        [
          {
            name: 'label_size_unit',
            config: {
              type: 'SelectControl',
              label: t('Label Size Unit'),
              description: t('TODO'),
              visibility: ({ form_data }) => !!form_data.enable_labels && !form_data.enable_label_javascript_mode,
              default: 'pixels',
              choices: [
                ['meters', t('Meters')],
                ['pixels', t('Pixels')],
              ],
            },
          }
        ],
        [
          {
            name: 'label_javascript_config_generator',
            config: {
              ...jsFunctionControl(
                t('Label JavaScript Config Generator'),
                t('TODO'),
                undefined,
                undefined,
                defaultLabelConfigGenerator,
              ),
              visibility: ({ form_data }) => !!form_data.enable_labels && !!form_data.enable_label_javascript_mode,
            },
          },
        ],
        [
          {
            name: 'enable_icons',
            config: {
              type: 'CheckboxControl',
              label: t('Enable Icons'),
              description: t('Show icons for points in the GeoJSON layer'),
              default: false,
            },
          }
        ],
        [
          {
            name: 'enable_icon_javascript_mode',
            config: {
              type: 'CheckboxControl',
              label: t('Enable Icon JavaScript Mode'),
              description: t('TODO'),
              visibility: ({ form_data }) => !!form_data.enable_icons,
              default: false,
            },
          }
        ],
        [
          {
            name: 'icon_javascript_config_generator',
            config: {
              ...jsFunctionControl(
                t('Icon JavaScript Config Generator'),
                t('TODO'),
                undefined,
                undefined,
                defaultIconConfigGenerator,
              ),
              visibility: ({ form_data }) => !!form_data.enable_icons && !!form_data.enable_icon_javascript_mode,
            },
          },
        ],
        [
          {
            name: 'icon_url',
            config: {
              type: 'TextControl',
              label: t('Icon URL'),
              description: t('GeoJSON property containing icon URL'),
              visibility: ({ form_data }) => !!form_data.enable_icons && !form_data.enable_icon_javascript_mode,
              default: 'https://static.thenounproject.com/png/888711-200.png',
            },
          }
        ],
        [
          {
            name: 'icon_size',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Icon Size'),
              description: t('Size of the icon'),
              visibility: ({ form_data }) => !!form_data.enable_icons && !form_data.enable_icon_javascript_mode,
              validators: [legacyValidateInteger],
              choices: formatSelectOptions([16, 24, 32, 48, 64, 128]),
              default: 64,
            },
          }
        ],
        [
          {
            name: 'icon_size_unit',
            config: {
              type: 'SelectControl',
              label: t('Icon Size Unit'),
              description: t('Unit of the icon size'),
              visibility: ({ form_data }) => !!form_data.enable_icons && !form_data.enable_icon_javascript_mode,
              default: 'pixels',
              choices: [
                ['meters', t('Meters')],
                ['pixels', t('Pixels')],
              ],
            },
          }
        ],
        [lineWidth],
        [
          {
            name: 'line_width_unit',
            config: {
              type: 'SelectControl',
              label: t('Line width unit'),
              default: 'pixels',
              choices: [
                ['meters', t('meters')],
                ['pixels', t('pixels')],
              ],
              renderTrigger: true,
            },
          },
        ],
        [
          {
            name: 'point_radius_scale',
            config: {
              type: 'SelectControl',
              freeForm: true,
              label: t('Point Radius Scale'),
              validators: [legacyValidateInteger],
              default: null,
              choices: formatSelectOptions([0, 100, 200, 300, 500]),
            },
          },
        ],
      ],
    },
    {
      label: t('Advanced'),
      controlSetRows: [
        [jsColumns],
        [jsDataMutator],
        [jsTooltip],
        [jsOnclickHref],
      ],
    },
  ],
};

export default config;
