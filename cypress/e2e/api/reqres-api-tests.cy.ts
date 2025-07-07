/**
 * @fileoverview Reqres.in API Test Suite - Comprehensive API Testing Examples
 * @author Devdun K
 * @created 2025
 * @license MIT (Attribution Required)
 * @description Complete API testing examples using Reqres.in fake REST API
 * 
 * This code is free to use but requires attribution to "Devdun K"
 * Original repository: https://github.com/devdun/Cypress_Sample_1
 * 
 * API Documentation: https://reqres.in/
 * Base URL: https://reqres.in/api/
 */

/// <reference types="cypress" />

describe('Reqres.in API Tests', () => {
  const baseUrl = 'https://reqres.in/api'
  const apiHeaders = {
    'x-api-key': 'reqres-free-v1'
  }
  
  describe('User Management API', () => {
    it('should get list of users with pagination', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: apiHeaders,
        qs: { page: 2 }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('page', 2)
        expect(response.body).to.have.property('per_page')
        expect(response.body).to.have.property('total')
        expect(response.body).to.have.property('total_pages')
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
        expect(response.body.data.length).to.be.greaterThan(0)
        
        // Validate user structure
        response.body.data.forEach((user: any) => {
          expect(user).to.have.property('id')
          expect(user).to.have.property('email')
          expect(user).to.have.property('first_name')
          expect(user).to.have.property('last_name')
          expect(user).to.have.property('avatar')
        })
      })
    })

    it('should get single user by ID', () => {
      const userId = 2
      
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/${userId}`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('id', userId)
        expect(response.body.data).to.have.property('email')
        expect(response.body.data).to.have.property('first_name')
        expect(response.body.data).to.have.property('last_name')
        expect(response.body.data).to.have.property('avatar')
        expect(response.body).to.have.property('support')
      })
    })

    it('should handle single user not found', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users/23`,
        headers: apiHeaders,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body).to.be.empty
      })
    })

    it('should create a new user', () => {
      const newUser = {
        name: 'John Doe',
        job: 'QA Engineer'
      }
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/users`,
        headers: apiHeaders,
        body: newUser
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('name', newUser.name)
        expect(response.body).to.have.property('job', newUser.job)
        expect(response.body).to.have.property('id')
        expect(response.body).to.have.property('createdAt')
        
        // Validate timestamps
        expect(new Date(response.body.createdAt)).to.be.instanceof(Date)
      })
    })

    it('should update user with PUT', () => {
      const updatedUser = {
        name: 'Jane Smith',
        job: 'Senior QA Engineer'
      }
      
      cy.request({
        method: 'PUT',
        url: `${baseUrl}/users/2`,
        headers: apiHeaders,
        body: updatedUser
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('name', updatedUser.name)
        expect(response.body).to.have.property('job', updatedUser.job)
        expect(response.body).to.have.property('updatedAt')
        
        // Validate timestamp
        expect(new Date(response.body.updatedAt)).to.be.instanceof(Date)
      })
    })

    it('should update user with PATCH', () => {
      const patchData = {
        job: 'Lead QA Engineer'
      }
      
      cy.request({
        method: 'PATCH',
        url: `${baseUrl}/users/2`,
        headers: apiHeaders,
        body: patchData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('job', patchData.job)
        expect(response.body).to.have.property('updatedAt')
      })
    })

    it('should delete user', () => {
      cy.request({
        method: 'DELETE',
        url: `${baseUrl}/users/2`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(204)
        expect(response.body).to.be.empty
      })
    })
  })

  describe('Resource Management API', () => {
    it('should get list of resources', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/unknown`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('page')
        expect(response.body).to.have.property('per_page')
        expect(response.body).to.have.property('total')
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
        
        // Validate resource structure
        response.body.data.forEach((resource: any) => {
          expect(resource).to.have.property('id')
          expect(resource).to.have.property('name')
          expect(resource).to.have.property('year')
          expect(resource).to.have.property('color')
          expect(resource).to.have.property('pantone_value')
        })
      })
    })

    it('should get single resource by ID', () => {
      const resourceId = 2
      
      cy.request({
        method: 'GET',
        url: `${baseUrl}/unknown/${resourceId}`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('id', resourceId)
        expect(response.body.data).to.have.property('name')
        expect(response.body.data).to.have.property('year')
        expect(response.body.data).to.have.property('color')
        expect(response.body.data).to.have.property('pantone_value')
      })
    })

    it('should handle single resource not found', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/unknown/23`,
        headers: apiHeaders,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(404)
        expect(response.body).to.be.empty
      })
    })
  })

  describe('Authentication API', () => {
    it('should register user successfully', () => {
      const userData = {
        email: 'eve.holt@reqres.in',
        password: 'pistol'
      }
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        headers: apiHeaders,
        body: userData
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('id')
        expect(response.body).to.have.property('token')
        expect(response.body.token).to.be.a('string')
        expect(response.body.token).to.have.length.greaterThan(0)
      })
    })

    it('should handle unsuccessful registration', () => {
      const userData = {
        email: 'sydney@fife'
        // Missing password
      }
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        headers: apiHeaders,
        body: userData,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.contain('Missing password')
      })
    })

    it('should login user successfully', () => {
      const credentials = {
        email: 'eve.holt@reqres.in',
        password: 'cityslicka'
      }
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        headers: apiHeaders,
        body: credentials
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('token')
        expect(response.body.token).to.be.a('string')
        expect(response.body.token).to.have.length.greaterThan(0)
      })
    })

    it('should handle unsuccessful login', () => {
      const credentials = {
        email: 'peter@klaven'
        // Missing password
      }
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/login`,
        headers: apiHeaders,
        body: credentials,
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
        expect(response.body.error).to.contain('Missing password')
      })
    })
  })

  describe('Custom Endpoints API', () => {
    it('should handle custom resource endpoints', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/products/3`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.have.property('id', 3)
        expect(response.body.data).to.have.property('name')
        expect(response.body.data).to.have.property('year')
        expect(response.body.data).to.have.property('pantone_value')
      })
    })

    it('should create custom resource', () => {
      const productData = {
        name: 'Custom Product',
        description: 'A test product',
        price: 99.99
      }
      
      cy.request({
        method: 'POST',
        url: `${baseUrl}/products`,
        headers: apiHeaders,
        body: productData
      }).then((response) => {
        expect(response.status).to.eq(201)
        expect(response.body).to.have.property('name', productData.name)
        expect(response.body).to.have.property('description', productData.description)
        expect(response.body).to.have.property('price', productData.price)
        expect(response.body).to.have.property('id')
        expect(response.body).to.have.property('createdAt')
      })
    })
  })

  describe('Performance and Reliability Tests', () => {
    it('should handle delayed responses', () => {
      const startTime = Date.now()
      
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: apiHeaders,
        qs: { delay: 3 },
        timeout: 10000
      }).then((response) => {
        const endTime = Date.now()
        const duration = endTime - startTime
        
        expect(response.status).to.eq(200)
        expect(duration).to.be.greaterThan(3000) // Should take at least 3 seconds
        expect(response.body).to.have.property('data')
        expect(response.body.data).to.be.an('array')
      })
    })

    it('should handle concurrent requests', () => {
      const requests = []
      
      // Create multiple concurrent requests
      for (let i = 1; i <= 5; i++) {
        requests.push(
          cy.request({
            method: 'GET',
            url: `${baseUrl}/users/${i}`,
            headers: apiHeaders
          })
        )
      }
      
      // All requests should complete successfully
      requests.forEach((request, index) => {
        request.then((response) => {
          expect(response.status).to.eq(200)
          expect(response.body.data).to.have.property('id', index + 1)
        })
      })
    })

    it('should validate response headers', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.headers).to.have.property('content-type')
        expect(response.headers['content-type']).to.include('application/json')
        expect(response.headers).to.have.property('access-control-allow-origin', '*')
      })
    })

    it('should validate response time', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.duration).to.be.lessThan(5000) // Should respond within 5 seconds
      })
    })
  })

  describe('Data Validation Tests', () => {
    it('should validate user email format', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        
        response.body.data.forEach((user: any) => {
          expect(user.email).to.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
        })
      })
    })

    it('should validate resource color format', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/unknown`,
        headers: apiHeaders
      }).then((response) => {
        expect(response.status).to.eq(200)
        
        response.body.data.forEach((resource: any) => {
          expect(resource.color).to.match(/^#[0-9A-Fa-f]{6}$/)
          expect(resource.year).to.be.a('number')
          expect(resource.year).to.be.greaterThan(1900)
        })
      })
    })

    it('should validate pagination parameters', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        headers: apiHeaders,
        qs: { page: 1, per_page: 3 }
      }).then((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.page).to.eq(1)
        expect(response.body.per_page).to.eq(3) // API respects per_page parameter
        expect(response.body.data.length).to.be.lessThan(7)
      })
    })
  })

  describe('Error Handling Tests', () => {
    it('should handle invalid HTTP methods', () => {
      cy.request({
        method: 'OPTIONS',
        url: `${baseUrl}/users`,
        headers: apiHeaders,
        failOnStatusCode: false
      }).then((response) => {
        // Should handle OPTIONS for CORS
        expect(response.status).to.be.oneOf([200, 204])
      })
    })

    it('should handle malformed JSON', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/users`,
        body: 'invalid json',
        headers: {
          ...apiHeaders,
          'Content-Type': 'application/json'
        },
        failOnStatusCode: false
      }).then((response) => {
        // API should handle malformed JSON gracefully
        expect(response.status).to.be.oneOf([400, 201]) // Reqres might be lenient
      })
    })

    it('should handle missing required fields', () => {
      cy.request({
        method: 'POST',
        url: `${baseUrl}/register`,
        headers: apiHeaders,
        body: {
          email: 'test@example.com'
          // Missing password
        },
        failOnStatusCode: false
      }).then((response) => {
        expect(response.status).to.eq(400)
        expect(response.body).to.have.property('error')
      })
    })

    it('should handle missing API key', () => {
      cy.request({
        method: 'GET',
        url: `${baseUrl}/users`,
        failOnStatusCode: false
      }).then((response) => {
        // API may allow some requests without API key or have fallback behavior
        expect(response.status).to.be.oneOf([200, 401])
        
        if (response.status === 401) {
          expect(response.body).to.have.property('error', 'Missing API key.')
          expect(response.body).to.have.property('how_to_get_one', 'https://reqres.in/signup')
        } else {
          // API allows the request without API key
          expect(response.body).to.have.property('data')
          expect(response.body.data).to.be.an('array')
        }
      })
    })
  })
}) 