import { Component } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.css'
})
export class ConfirmDialogComponent {
  title = '';
  message = '';
  btnOkText = '';
  btnCancelText = '';
  result = false;

  constructor(public bsmodalRef: BsModalRef) { }

  confirm() {
    this.result = true;
    this.bsmodalRef.hide();
  }

  decline() {
    this.bsmodalRef.hide();
  }
}
