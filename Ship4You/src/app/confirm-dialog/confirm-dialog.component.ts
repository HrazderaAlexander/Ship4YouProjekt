import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})


export class ConfirmDialogComponent {

  /**
   * Variable to save title
   */
  title: string;

  /**
   * Variable to save message
   */
  message: string;
 
  /**
   * 
   * @param dialogRef 
   * @param data
   */
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    
    /**
     * Update view with given values
     */
    this.title = data.title;
    this.message = data.message;
  }
  
  /**
   * Methode which will be called if user click confirm button
   */
  onConfirm(): void {
    /**
     * Dialog will be closed
     */
    this.dialogRef.close(true);
  }
 
  /**
   * Methode will be called if user cancel dialog
   */
  onDismiss(): void {
    /**
     * Close dialog
     */
    this.dialogRef.close(false);
  }
}

/**
 * ConfirmDialogModel
 */
export class ConfirmDialogModel {
  
  /**
   * 
   * @param title -> data
   * @param message -> data
   */
  constructor(public title: string, public message: string) {}
}