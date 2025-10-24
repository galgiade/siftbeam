"""
Cognito ユーザー削除 Lambda
指定されたcustomerIdを持つ全てのCognitoユーザーを削除
"""

import json
import os
import boto3
from typing import Dict, Any, List

cognito_client = boto3.client('cognito-idp')

USER_POOL_ID = os.environ['COGNITO_USER_POOL_ID']


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    指定されたcustomerIdを持つ全てのCognitoユーザーを削除
    
    Args:
        event: {
            "customerId": "cus_xxx",
            "executionId": "arn:aws:states:..."
        }
    
    Returns:
        {
            "statusCode": 200,
            "deletedUsers": ["user1", "user2", ...],
            "deletedCount": 2
        }
    """
    try:
        customer_id = event['customerId']
        execution_id = event.get('executionId', 'unknown')
        
        print(f"Starting Cognito user deletion for customerId: {customer_id}")
        print(f"Execution ID: {execution_id}")
        
        # customerIdを持つ全ユーザーを取得
        users = list_users_by_customer_id(customer_id)
        
        if not users:
            print(f"No users found for customerId: {customer_id}")
            return {
                'statusCode': 200,
                'deletedUsers': [],
                'deletedCount': 0,
                'message': 'No users found'
            }
        
        # 各ユーザーを削除
        deleted_users = []
        for user in users:
            username = user['Username']
            try:
                cognito_client.admin_delete_user(
                    UserPoolId=USER_POOL_ID,
                    Username=username
                )
                deleted_users.append(username)
                print(f"Deleted user: {username}")
            except Exception as e:
                print(f"Error deleting user {username}: {str(e)}")
                # エラーがあっても続行
        
        print(f"Successfully deleted {len(deleted_users)} users for customerId: {customer_id}")
        
        return {
            'statusCode': 200,
            'deletedUsers': deleted_users,
            'deletedCount': len(deleted_users),
            'totalFound': len(users),
            'customerId': customer_id
        }
        
    except Exception as e:
        print(f"Error in lambda_handler: {str(e)}")
        return {
            'statusCode': 500,
            'error': str(e),
            'message': 'Failed to delete Cognito users'
        }


def list_users_by_customer_id(customer_id: str) -> List[Dict[str, Any]]:
    """
    指定されたcustomerIdを持つ全ユーザーを取得
    
    Args:
        customer_id: Stripe customer ID
    
    Returns:
        ユーザーのリスト
    """
    users = []
    pagination_token = None
    
    try:
        while True:
            params = {
                'UserPoolId': USER_POOL_ID,
                'Filter': f'"custom:customerId" = "{customer_id}"',
                'Limit': 60  # Cognitoの制限
            }
            
            if pagination_token:
                params['PaginationToken'] = pagination_token
            
            response = cognito_client.list_users(**params)
            
            if 'Users' in response:
                users.extend(response['Users'])
            
            pagination_token = response.get('PaginationToken')
            
            if not pagination_token:
                break
        
        return users
        
    except Exception as e:
        print(f"Error listing users: {str(e)}")
        raise

