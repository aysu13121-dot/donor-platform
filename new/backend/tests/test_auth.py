def test_signup_creates_user(client):
    res = client.post('/api/signup', json={
        'email': 'test@example.com',
        'password': 'secret123',
        'full_name': 'Test User',
        'blood_type': 'A+',
        'city': 'Bakı',
    })
    assert res.status_code == 201
    body = res.get_json()
    assert body['user']['email'] == 'test@example.com'
    assert 'password_hash' not in body['user']
    assert body['token']


def test_signup_rejects_duplicate_email(client):
    payload = {'email': 'dup@example.com', 'password': 'secret123'}
    first = client.post('/api/signup', json=payload)
    second = client.post('/api/signup', json=payload)
    assert first.status_code == 201
    assert second.status_code == 409


def test_signup_rejects_invalid_email(client):
    res = client.post('/api/signup', json={'email': 'not-an-email', 'password': 'secret123'})
    assert res.status_code == 400


def test_signup_rejects_short_password(client):
    res = client.post('/api/signup', json={'email': 'short@example.com', 'password': 'abc'})
    assert res.status_code == 400


def test_login_success_returns_token(client):
    res = client.post('/api/login', json={'email': 'leyla@example.com', 'password': 'password123'})
    assert res.status_code == 200
    body = res.get_json()
    assert 'token' in body
    assert body['user']['email'] == 'leyla@example.com'


def test_login_wrong_password_fails(client):
    res = client.post('/api/login', json={'email': 'leyla@example.com', 'password': 'wrong'})
    assert res.status_code == 401


def test_me_requires_token(client):
    res = client.get('/api/me')
    assert res.status_code == 401


def test_me_returns_current_user(client, donor_auth):
    res = client.get('/api/me', headers=donor_auth['headers'])
    assert res.status_code == 200
    assert res.get_json()['user']['email'] == 'leyla@example.com'


def test_me_update_persists_changes(client, donor_auth):
    res = client.put('/api/me', headers=donor_auth['headers'], json={'city': 'Gəncə', 'is_available': 0})
    assert res.status_code == 200
    body = res.get_json()
    assert body['user']['city'] == 'Gəncə'
    assert body['user']['is_available'] == 0


def test_me_delete_removes_account(client, donor_auth):
    res = client.delete('/api/me', headers=donor_auth['headers'])
    assert res.status_code == 200

    followup = client.get('/api/me', headers=donor_auth['headers'])
    assert followup.status_code == 401
