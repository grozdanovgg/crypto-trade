import { TestBed, inject } from '@angular/core/testing';

import { CrossingIndicatorsService } from './crossing-indicators.service';

describe('CrossingIndicatorsService', () => {
	beforeEach(() => {
		TestBed.configureTestingModule({
			providers: [CrossingIndicatorsService]
		});
	});

	it('should be created', inject([CrossingIndicatorsService], (service: CrossingIndicatorsService) => {
		expect(service).toBeTruthy();
	}));
});
