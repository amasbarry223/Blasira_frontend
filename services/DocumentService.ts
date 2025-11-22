import { Document, CreateDocumentDto, UpdateDocumentDto } from '../models';

export class DocumentService {
  private baseUrl: string;

  constructor(baseUrl: string = '/api') {
    this.baseUrl = baseUrl;
  }

  async getAll(): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/documents`);
    if (!response.ok) {
      throw new Error('Failed to fetch documents');
    }
    return response.json();
  }

  async getById(id: number): Promise<Document> {
    const response = await fetch(`${this.baseUrl}/documents/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch document with id ${id}`);
    }
    return response.json();
  }

  async getByDriverProfileId(driverProfileId: number): Promise<Document[]> {
    const response = await fetch(`${this.baseUrl}/documents/driver/${driverProfileId}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch documents for driver ${driverProfileId}`);
    }
    return response.json();
  }

  async create(data: CreateDocumentDto): Promise<Document> {
    const response = await fetch(`${this.baseUrl}/documents`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error('Failed to create document');
    }
    return response.json();
  }

  async update(id: number, data: UpdateDocumentDto): Promise<Document> {
    const response = await fetch(`${this.baseUrl}/documents/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      throw new Error(`Failed to update document with id ${id}`);
    }
    return response.json();
  }

  async delete(id: number): Promise<void> {
    const response = await fetch(`${this.baseUrl}/documents/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Failed to delete document with id ${id}`);
    }
  }
}

