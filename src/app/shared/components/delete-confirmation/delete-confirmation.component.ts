import { Component, Inject } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NZ_MODAL_DATA } from 'ng-zorro-antd/modal';

@Component({
  standalone: true,
  selector: 'delete-confirmation',
  template: `
    <div class="d-flex align-items-center font-24 font-500">
      <svg
        class="mr-2"
        xmlns="http://www.w3.org/2000/svg"
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 22.6665C16.3778 22.6665 16.6945 22.5387 16.95 22.2832C17.2056 22.0276 17.3333 21.7109 17.3333 21.3332C17.3333 20.9554 17.2056 20.6387 16.95 20.3832C16.6945 20.1276 16.3778 19.9998 16 19.9998C15.6222 19.9998 15.3056 20.1276 15.05 20.3832C14.7945 20.6387 14.6667 20.9554 14.6667 21.3332C14.6667 21.7109 14.7945 22.0276 15.05 22.2832C15.3056 22.5387 15.6222 22.6665 16 22.6665ZM14.6667 17.3332H17.3333V9.33317H14.6667V17.3332ZM16 29.3332C14.1556 29.3332 12.4222 28.9832 10.8 28.2832C9.17778 27.5832 7.76667 26.6332 6.56667 25.4332C5.36667 24.2332 4.41667 22.8221 3.71667 21.1998C3.01667 19.5776 2.66667 17.8443 2.66667 15.9998C2.66667 14.1554 3.01667 12.4221 3.71667 10.7998C4.41667 9.17762 5.36667 7.7665 6.56667 6.5665C7.76667 5.3665 9.17778 4.4165 10.8 3.7165C12.4222 3.0165 14.1556 2.6665 16 2.6665C17.8444 2.6665 19.5778 3.0165 21.2 3.7165C22.8222 4.4165 24.2333 5.3665 25.4333 6.5665C26.6333 7.7665 27.5833 9.17762 28.2833 10.7998C28.9833 12.4221 29.3333 14.1554 29.3333 15.9998C29.3333 17.8443 28.9833 19.5776 28.2833 21.1998C27.5833 22.8221 26.6333 24.2332 25.4333 25.4332C24.2333 26.6332 22.8222 27.5832 21.2 28.2832C19.5778 28.9832 17.8444 29.3332 16 29.3332Z"
          fill="#FF6161"
        />
      </svg>
      Confirmation!
    </div>
    <p class="delete-confirmation__content__message mt-3">
      Are you sure you want to delete this {{ data.title }}?
    </p>
    <div class="d-flex justify-content-end mt-4">
      <button nz-button class="btn-a-secondary mr-2" (click)="cancel()">
        Cancel
      </button>
      <button nz-button class="btn-a-primary" (click)="confirm()">
        Delete
      </button>
    </div>
  `,
  styles: [``],
  imports: [NzButtonComponent],
})
export class DeleteConfirmationComponent {
  constructor(@Inject(NZ_MODAL_DATA) public data: any) {}

  cancel() {
    this.data?.onCancel();
  }

  confirm() {
    this.data?.onConfirm();
  }
}
