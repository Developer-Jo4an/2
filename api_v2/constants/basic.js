export const basicGameData = {
  "account": {
    "last_exchange_on_boxes": null,
    "last_exchange_on_money": null,
    "last_time_disaster": null,
    "tobacco_amount": 100000000000,
    "boxes_amount": 100000000000,
    "money_amount": 100000000000,
    "world_state": {
      "area_1": {
        "cell_0": {
          "type": "road",
          "cell": "cell_0",
          "improvement": {
            "id": "ce0bdc6d-0276-48a3-a1c0-b4d3dc1fc259",
            "title": "Уровень #1",
            "amplification_value": 0.5,
            "amplification_area": "area",
            "cost": 0,
            "repair_cost": 0,
            "destroy_cost": 0,
            "construction_time": 0,
            "next_improvement": "9c67aa58-8946-42d1-900e-d4ac11c98d01",
            "is_start_improvement": true,
            "production_time": null,
            "production_cost": null,
            "production_cost_type": null,
            "production_quantity": null,
            "production_type": null
          },
          "produce_start": null,
          "is_broken": false,
          "last_time_collected": null,
          "start_upgrading": 1679567219,
          "last_time_upgraded": 1679567219
        }
      }
    }
  },
  "areas": [
    {
      "name": "area_1",
      "open_cost": 0,
      "cells_amount": 20
    },
    {
      "name": "area_2",
      "open_cost": 30000,
      "cells_amount": 20
    },
    {
      "name": "area_3",
      "open_cost": 60000,
      "cells_amount": 20
    }
  ],
  "exchanger": [],
  "buildings": [
    {
      "type": "road",
      "amplification_area": "area",
      "improvements": [
        {
          "id": "ce0bdc6d-0276-48a3-a1c0-b4d3dc1fc259",
          "title": "Уровень #1",
          "amplification_value": 0.5,
          "amplification_area": "area",
          "cost": 0,
          "repair_cost": 0,
          "destroy_cost": 0,
          "construction_time": 0,
          "next_improvement": "9c67aa58-8946-42d1-900e-d4ac11c98d01",
          "is_start_improvement": true,
          "production_time": null,
          "production_cost": null,
          "production_cost_type": null,
          "production_quantity": null,
          "production_type": null,
          "bonus_multiplier": null,
          "bonus_chance": null,
        },
        {
          "id": "9c67aa58-8946-42d1-900e-d4ac11c98d01",
          "title": "Уровень #2",
          "amplification_value": 1,
          "amplification_area": "area",
          "cost": 30000,
          "repair_cost": 10000,
          "destroy_cost": 5000,
          "construction_time": 120000,
          "next_improvement": "5f73d0dc-3b45-4204-ae75-26a1f5bdc7af",
          "is_start_improvement": false,
          "production_time": null,
          "production_cost": null,
          "production_cost_type": null,
          "production_quantity": null,
          "production_type": null,
          "bonus_multiplier": null,
          "bonus_chance": null,
        },
        {
          "id": "5f73d0dc-3b45-4204-ae75-26a1f5bdc7af",
          "title": "Уровень #3",
          "amplification_value": 2,
          "amplification_area": "area",
          "cost": 60000,
          "repair_cost": 15000,
          "destroy_cost": 5000,
          "construction_time": 120000,
          "next_improvement": null,
          "is_start_improvement": false,
          "production_time": null,
          "production_cost": null,
          "production_cost_type": null,
          "production_quantity": null,
          "production_type": null,
          "bonus_multiplier": null,
          "bonus_chance": null,
        }
      ]
    },
    {
      "type": "store",
      "amplification_area": null,
      "improvements": [
        {
          "id": "9c67aa58-8926-42d1-900e-d4ac11c98d01",
          "next_improvement": "5f73d0dc-3b45-4204-ae75-26a1f5bdc7ff",
          "is_start_improvement": true,
          "title": "Уровень #1",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 10000,
          "production_time": 120,
          "production_cost": 10,
          "production_cost_type": "boxes",
          "production_quantity": 5,
          "production_type": "money",
          "bonus_multiplier": 1.5,
          "bonus_chance": 0.2,
          "repair_cost": 5000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "5f73d0dc-3b45-4204-ae75-26a1f5bdc7ff",
          "next_improvement": "5f73d0dc-3b45-4204-ae75-jda1f5bdc7ff",
          "is_start_improvement": false,
          "title": "Уровень #2",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 30000,
          "production_ime": 12,
          "production_cost": 10,
          "production_cost_type": "boxes",
          "production_quantity": 5,
          "production_type": "money",
          "bonus_multiplier": 2,
          "bonus_chance": 0.5,
          "repair_cost": 10000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "5f73d0dc-3b45-4204-ae75-jda1f5bdc7ff",
          "title": "Уровень #3",
          "next_improvement": null,
          "is_start_improvement": false,
          "amplification_value": null,
          "amplification_area": null,
          "cost": 60000,
          "production_time": 120,
          "production_cost": 10,
          "production_cost_type": "boxes",
          "production_quantity": 5,
          "production_type": "money",
          "bonus_multiplier": 3,
          "bonus_chance": 0.6,
          "repair_cost": 15000,
          "destroy_cost": 5000,
          "construction_time": 120000
        }
      ]
    },
    {
      "type": "factory",
      "amplification_area": null,
      "improvements": [
        {
          "id": "91cfa07e-0bc3-4929-ba8b-1bb56c61a4e9",
          "next_improvement": "b6b53309-96c1-4f8f-bc91-20d991735437",
          "is_start_improvement": true,
          "title": "Уровень #1",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 10000,
          "production_time": 120,
          "production_cost": 10,
          "production_cost_type": "tobacco",
          "production_quantity": 5,
          "production_type": "boxes",
          "bonus_multiplier": 1.5,
          "bonus_chance": 0.2,
          "repair_cost": 5000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "b6b53309-96c1-4f8f-bc91-20d991735437",
          "next_improvement": "5a3b620b-c0e2-45ff-9921-6a3df01e418a",
          "is_start_improvement": false,
          "title": "Уровень #2",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 30000,
          "production_time": 120,
          "production_cost": 10,
          "production_cost_type": "tobacco",
          "production_quantity": 5,
          "production_type": "boxes",
          "bonus_multiplier": 2,
          "bonus_chance": 0.5,
          "repair_cost": 10000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "5a3b620b-c0e2-45ff-9921-6a3df01e418a",
          "next_improvement": null,
          "is_start_improvement": false,
          "title": "Уровень #3",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 60000,
          "production_time": 120,
          "production_cost": 10,
          "production_cost_type": "tobacco",
          "production_quantity": 5,
          "production_type": "boxes",
          "bonus_multiplier": 3,
          "bonus_chance": 0.6,
          "repair_cost": 15000,
          "destroy_cost": 5000,
          "construction_time": 120000
        }
      ]
    },
    {
      "type": "field",
      "amplification_area": null,
      "improvements": [
        {
          "id": "a2896bcf-4f4c-490f-89b5-68a5b3a71d60",
          "next_improvement": "297a1922-582d-45e9-8129-448c3fb45d39",
          "is_start_improvement": true,
          "title": "Уровень #1",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 10000,
          "production_time": 120,
          "production_cost": 0,
          "production_cost_type": "tobacco",
          "production_quantity": 5,
          "production_type": "tobacco",
          "bonus_multiplier": 1.5,
          "bonus_chance": 0.2,
          "repair_cost": 5000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "297a1922-582d-45e9-8129-448c3fb45d39",
          "next_improvement": "1c72ed48-5e8c-4971-b582-cfae3314cc6e",
          "is_start_improvement": false,
          "title": "Уровень #2",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 30000,
          "production_time": 120,
          "production_cost": 0,
          "production_cost_type": "tobacco",
          "production_quantity": 5,
          "production_type": "tobacco",
          "bonus_multiplier": 2,
          "bonus_chance": 0.5,
          "repair_cost": 10000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "1c72ed48-5e8c-4971-b582-cfae3314cc6e",
          "next_improvement": null,
          "is_start_improvement": false,
          "title": "Уровень #3",
          "amplification_value": null,
          "amplification_area": null,
          "cost": 60000,
          "production_time": 120,
          "production_cost": 0,
          "production_cost_type": "tobacco",
          "production_quantity": 5,
          "production_type": "tobacco",
          "bonus_multiplier": 3,
          "bonus_chance": 0.5,
          "repair_cost": 15000,
          "destroy_cost": 5000,
          "construction_time": 120000
        }
      ]
    },
    {
      "type": "office",
      "amplification_area": "building",
      "improvements": [
        {
          "id": "69dbf582-e68a-49c5-b134-5f8dbf0984d4",
          "next_improvement": "c675c0d9-eb0f-4b4d-8b0f-10666f5f7b99",
          "is_start_improvement": true,
          "title": "Уровень #1",
          "amplification_value": 2,
          "amplification_area": "building",
          "cost": 10000,
          "production_time": null,
          "production_cost": null,
          "production_cost_type": null,
          "production_quantity": null,
          "production_type": null,
          "bonus_multiplier": null,
          "bonus_chance": null,
          "repair_cost": 5000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "c675c0d9-eb0f-4b4d-8b0f-10666f5f7b99",
          "next_improvement": "7cfdeac4-45a3-4dfe-a77c-e2b6c9a2a5d6",
          "is_start_improvement": false,
          "title": "Уровень #2",
          "amplification_value": 3,
          "amplification_area": "building",
          "cost": 30000,
          "production_time": null,
          "production_cost": null,
          "production_cost_type": null,
          "production_quantity": null,
          "production_type": null,
          "bonus_multiplier": null,
          "bonus_chance": null,
          "repair_cost": 10000,
          "destroy_cost": 5000,
          "construction_time": 120000
        },
        {
          "id": "7cfdeac4-45a3-4dfe-a77c-e2b6c9a2a5d6",
          "next_improvement": null,
          "is_start_improvement": false,
          "title": "Уровень #3",
          "amplification_value": 4,
          "amplification_area": "building",
          "cost": 60000,
          "production_time": null,
          "production_cost": null,
          "production_cost_type": null,
          "production_quantity": null,
          "production_type": null,
          "bonus_multiplier": null,
          "bonus_chance": null,
          "repair_cost": 15000,
          "destroy_cost": 5000,
          "construction_time": 120000
        }
      ]
    }
  ]
}
