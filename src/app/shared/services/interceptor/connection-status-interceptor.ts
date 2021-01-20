import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ConnectionStatusProviderService } from '../connection-status-provider.service';

@Injectable()
export class ConnectionStatusInterceptor implements HttpInterceptor {

    constructor(private connectionStatusProviderService : ConnectionStatusProviderService) {}

    intercept(request : HttpRequest<any>, next : HttpHandler) : Observable<HttpEvent<any>> {
       
        //All of the backend end points match the pattern $(backend url)/mealoptimizer/$(tag), we need not use [].
        //We use [] to accomodate future changes.
        let result = request.url.match(/.*mealoptimizer\/([a-z]+\/[a-z]+)/) || [];
        let tag = result[1].replace('/', '-');
        if(this.connectionStatusProviderService.getConnectionStatus()) {
            return next.handle(request);
        }
        //If network connection is not available
        else {
            if(request.method === 'GET' || 
               request.method === 'POST' || 
               request.method === 'PUT' || 
               request.method === 'DELETE') {
                navigator.serviceWorker.ready
                  .then((swRegistration) => swRegistration.sync.register(tag))
                  .catch(console.log);
            }  
        }
    }
}