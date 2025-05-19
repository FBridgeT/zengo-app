import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Region } from './models/Region';
import { City } from './models/City';
import { CityService } from './services/city.service';
import { RegionService } from './services/region.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, MatInputModule, MatSelectModule, MatFormFieldModule, MatTableModule, MatIconModule, MatDividerModule, MatButtonModule, MatCardModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'zengo-app';
  regions: Array<Region> = [];
  cities: Array<City> = [];

  private regionService = inject(RegionService);
  private cityService = inject(CityService);
  private snackBar = inject(MatSnackBar);


  columnHeaders: Array<string> = ['name', 'actions'];
  isRegionSelected: boolean = false;
  selectedRegionId?: number;
  selectedRegionName?: string;
  selectedCityName?: string;
  selectedCityId?: number;

  constructor() {
    this.regionService.get().subscribe(allRegions => {
      this.regions = allRegions;
    })
  }

  onRegionSelect(event: Event): void {
    if (event === undefined) {
      this.isRegionSelected = false;
      this.selectedRegionId = 0;
      this.snackBar.open('Nem létező megye!', '', {
        duration: 2500
      });
      return;
    } else {
      this.isRegionSelected = true;
      this.selectedRegionId = +event;
      this.selectedRegionName = this.regions.find(x => x.id === this.selectedRegionId)?.name;
      this.getCities(this.selectedRegionId!);
    }
  }

  addNewCity(): void {
    let cityName = document.getElementById('newCityName') as HTMLInputElement;
    if (!this.validateCityName(cityName.value)) {
      this.snackBar.open('Érvénytelen városnevet adott meg', '', {
        duration: 2500
      });
      return;
    }
    this.cityService.post(cityName.value.trim(), this.selectedRegionId!).subscribe(
      {
        next: () => {
          cityName.value = '';
          this.getCities(this.selectedRegionId!);
          this.snackBar.open('Város sikeresen létrehozva!', '', {
            duration: 2500
          });
        },
        error: () => {
          this.snackBar.open('Hiba történt a város létrehozásakor!', '', {
            duration: 2500
          });
          return;
        }
      });
  }

  saveNewCity(): void {
    let updatedName = (document.getElementById('updatedCityName') as HTMLInputElement).value;
    if (!this.validateCityName(updatedName)) {
      this.snackBar.open('Városnév nem lehet csupa whitespace!', '', {
        duration: 2500
      });
      return;
    }
    let city: City = { id: this.selectedCityId!, name: updatedName, regionId: this.selectedRegionId! };
    this.cityService.put(city).subscribe({
      next: () => {
        this.getCities(this.selectedRegionId!);
        this.snackBar.open('Város sikeresen megváltoztatva!', '', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Hiba történt a város létrehozásakor!', '', {
          duration: 2500
        });
        return;
      }
    });
    this.closeEditCityModal();
  }

  deleteCity(row: City) {
    if (row == null) {
      this.snackBar.open('Nem választott ki várost!', '', {
        duration: 2500
      });
      return;
    }
    this.cityService.delete(row.id).subscribe({
      next: () => {
        this.getCities(this.selectedRegionId!);
        this.snackBar.open('Város sikeresen törölve!', '', {
          duration: 2500
        });
      },
      error: () => {
        this.snackBar.open('Hiba történt a város létrehozásakor!', '', {
          duration: 2500
        });
        return;
      }
    });
  }

  getCities(selectedRegionId: number) {
    this.cityService.get(selectedRegionId).subscribe(allCity => {
      this.cities = allCity;
    })
  }

  openEditCityModal(city: City): void {
    if (city.name.trim() == '') {
      this.snackBar.open('Városnév nem lehet csupa whitespace!', '', {
        duration: 2500
      });
      return;
    }
    this.selectedCityName = city.name;
    this.selectedCityId = city.id;
    const modal = document.getElementById('modal');
    if (modal != null) {
      modal.style.display = 'block';
    }
  }

  closeEditCityModal(): void {
    const modal = document.getElementById('modal');
    if (modal != null) {
      modal.style.display = 'none';
    }
  }

  validateCityName(cityName: string): boolean
  {
    const regex = new RegExp('^[a-zA-ZéÉáÁöÖüÜóÓőŐúÚűŰÍ]+$');
    return regex.test(cityName);
  }
}
