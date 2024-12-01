import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../../shared/services/http.service';
import { NzMessageService } from 'ng-zorro-antd/message';

@Component({
  selector: 'app-resources',
  templateUrl: './resources.component.html',
  styleUrl: './resources.component.scss',
})
export class ResourcesComponent implements OnInit {
  nonDomainSubjects: any;
  domainSubjects: any;
  videoLinks: any;
  newspapers: any;
  pyqs: any;

  searchNewspaper: string = '';
  searchNewspaperDate: any;
  totalNewspaper: number = 0;
  newspaperPageIndex: number = 1;
  newspaperPageSize: number = 30;

  searchVideo: string = '';
  totalVideos: number = 0;
  videosPageIndex: number = 1;
  videosPageSize: number = 30;

  isInvalidModal: boolean = false;

  constructor(
    private readonly router: Router,
    private http: HttpService,
    private message: NzMessageService,
  ) {}

  ngOnInit() {
    this.getSubjects();
    this.getVideoLinks();
    this.getNewspapers();
    this.getPYQs();
  }

  getSubjects() {
    this.http.getSubjects().subscribe({
      next: (res: any) => {
        this.nonDomainSubjects = res?.data?.filter(
          (item: any) => item['isDomain'] === false,
        );
        this.domainSubjects = res?.data?.filter(
          (item: any) => item['isDomain'] === true,
        );
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  getVideoLinks(event?: any) {
    const data: any = {
      page: this.videosPageIndex,
      limit: this.videosPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
    }

    if (this.searchVideo) {
      data['search'] = this.searchVideo;
    }

    this.http.getVideoLinks(data).subscribe({
      next: (res: any) => {
        this.videoLinks = res?.data?.videoLinks;
        this.totalVideos = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  getNewspapers(event?: any) {
    const data: any = {
      page: this.videosPageIndex,
      limit: this.videosPageSize,
    };

    if (event) {
      data['page'] = event.pageIndex;
      data['limit'] = event.pageSize;
    }

    if (this.searchNewspaper) {
      data['search'] = this.searchNewspaper;
    }

    if (this.searchNewspaperDate) {
      const date = this.searchNewspaperDate;
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-based
      const day = String(date.getDate()).padStart(2, '0');
      data['date'] = `${year}-${month}-${day}`;
    }

    this.http.getNewspapers(data).subscribe({
      next: (res: any) => {
        this.newspapers = res?.data?.newspapers;
        this.totalNewspaper = res?.data?.total;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  getPYQs() {
    this.http.getPYQs().subscribe({
      next: (res: any) => {
        this.pyqs = res?.data;
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  onClickSubject(subjectId: number) {
    this.router.navigate(['/student/resources', subjectId]);
  }

  onViewVideo(id: number) {
    this.http.postLogAccess({ itemId: id, itemType: 'video' }).subscribe({
      next: (res: any) => {
        // Nothing to do
      },
      error: (error: any) => {
        console.log(error);
        this.message?.error(error?.error?.message);
      },
    });
  }

  protected readonly Math = Math;
}
