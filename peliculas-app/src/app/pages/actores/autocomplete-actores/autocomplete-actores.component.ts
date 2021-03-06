import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
  OnChanges,
} from '@angular/core';

import { FormControl } from '@angular/forms';
import { ActoresService } from '../../../services/actores.service';
import { MatTable } from '@angular/material/table';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { ActorDTO, ActorPeliculaDTO } from '../../../models/actor.model';
import { startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete-actores',
  templateUrl: './autocomplete-actores.component.html',
  styleUrls: ['./autocomplete-actores.component.css'],
})
export class AutocompleteActoresComponent implements OnInit, OnChanges {
  control: FormControl;
  actoresFiltrados: ActorPeliculaDTO[] = [];
  actoresSeleccionados: ActorPeliculaDTO[] = [];

  @ViewChild(MatTable) table: MatTable<any>;
  @Input() actoresIniciales: ActorPeliculaDTO[];
  @Output() selectedActors: EventEmitter<any> = new EventEmitter<any>();

  constructor(private actorSvc: ActoresService) {
    this.control = new FormControl();
  }

  ngOnInit(): void {
    this.control.valueChanges
      .pipe(startWith(' '))
      .subscribe((nombre: string) => {
        if (nombre.length > 0) {
          this.actorSvc.obtenerActorPorNombre(nombre).subscribe((actores) => {
            this.actoresFiltrados = <ActorPeliculaDTO[]>actores;
          });
        } else {
          this.actoresFiltrados = [];
        }
      });
  }

  ngOnChanges() {
    if (this.actoresIniciales) {
      this.actoresSeleccionados = this.actoresIniciales;
    }
  }

  seleccionarActor(event: any) {
    const actorSeleccionado = event.option.value;

    if (this.actoresSeleccionados.length > 0) {
      const index = this.actoresSeleccionados.findIndex(
        (a) => a.id === actorSeleccionado.id
      );

      if (index < 0) {
        this.actoresSeleccionados.push(actorSeleccionado);
      }
    } else {
      this.actoresSeleccionados.push(actorSeleccionado);
    }

    this.control.patchValue('');

    if (this.table !== undefined) {
      this.table.renderRows();
    }

    this.enviarActor();
  }

  eliminar(actor: ActorDTO) {
    const index = this.actoresSeleccionados.findIndex((a) => a.id === actor.id);

    this.actoresSeleccionados.splice(index, 1);

    this.table.renderRows();

    this.enviarActor();
  }

  enviarActor() {
    if (this.actoresSeleccionados.length > 0) {
      this.selectedActors.emit(this.actoresSeleccionados);
    }
  }

  drop(event: CdkDragDrop<any[]>) {
    moveItemInArray(
      this.actoresSeleccionados,
      event.previousIndex,
      event.currentIndex
    );

    this.table.renderRows();
  }
}
