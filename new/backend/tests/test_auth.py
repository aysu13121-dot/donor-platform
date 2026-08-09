import uuid


def _signup_payload(**overrides):
    payload = {
        'email': f"signup-{uuid.uuid4().hex[:10]}@test.example",
        'password': 'password123',
        'full_name': 'Yeni İstifadəçi',
        'phone': '+994501234567',
    }
    payload.update(overrides)
    return payload


def test_signup_missing_fields_fails(client):
    res = client.post('/api/signup', json={'email': 'incomplete@test.example'})
    assert res.status_code == 422


def test_signup_rejects_invalid_phone(client):
    res = client.post('/api/signup', json=_signup_payload(phone='12345'))
    assert res.status_code == 422


def test_signup_rejects_short_password(client):
    res = client.post('/api/signup', json=_signup_payload(password='123'))
    assert res.status_code == 422


def test_signup_accepts_local_phone_format(client, cleanup_emails):
    payload = _signup_payload(phone='0501234567')
    cleanup_emails.append(payload['email'])
    res = client.post('/api/signup', json=payload)
    assert res.status_code == 201


def test_signup_creates_user_and_sets_auth_cookie(client, cleanup_emails):
    payload = _signup_payload()
    cleanup_emails.append(payload['email'])
    res = client.post('/api/signup', json=payload)
    assert res.status_code == 201
    assert 'token' not in res.get_json()
    set_cookie_names = [c.split('=', 1)[0] for c in res.headers.get_all('Set-Cookie')]
    assert 'access_token_cookie' in set_cookie_names


def test_signup_rejects_duplicate_email(client, cleanup_emails):
    payload = _signup_payload()
    cleanup_emails.append(payload['email'])
    first = client.post('/api/signup', json=payload)
    assert first.status_code == 201
    second = client.post('/api/signup', json=payload)
    assert second.status_code == 409


def test_signin_wrong_password_fails(client, donor_auth):
    res = client.post('/api/signin', json={'email': donor_auth['user']['email'], 'password': 'wrong-password'})
    assert res.status_code == 401


def test_signin_success(client, donor_auth):
    res = client.post('/api/signin', json={'email': donor_auth['user']['email'], 'password': 'password123'})
    assert res.status_code == 200
    assert res.get_json()['user']['email'] == donor_auth['user']['email']


def test_me_requires_auth(client):
    res = client.get('/api/me')
    assert res.status_code == 401


def test_me_returns_current_user(donor_auth):
    res = donor_auth['client'].get('/api/me')
    assert res.status_code == 200
    assert res.get_json()['user']['email'] == donor_auth['user']['email']


def test_me_update_persists_changes(donor_auth):
    res = donor_auth['client'].put('/api/me', json={'city': 'Sumqayıt', 'is_available': False})
    assert res.status_code == 200
    body = res.get_json()
    assert body['user']['city'] == 'Sumqayıt'
    assert body['user']['is_available'] is False


def test_me_update_rejects_invalid_phone(donor_auth):
    res = donor_auth['client'].put('/api/me', json={'phone': '12345'})
    assert res.status_code == 422


def test_me_update_rejects_empty_blood_type(donor_auth):
    res = donor_auth['client'].put('/api/me', json={'blood_type': ''})
    assert res.status_code == 422


def test_me_update_rejects_empty_city(donor_auth):
    res = donor_auth['client'].put('/api/me', json={'city': ''})
    assert res.status_code == 422


def test_logout_clears_session(donor_auth):
    res = donor_auth['client'].post('/api/logout')
    assert res.status_code == 200
    followup = donor_auth['client'].get('/api/me')
    assert followup.status_code == 401


def test_me_delete_removes_account(donor_auth):
    res = donor_auth['client'].delete('/api/me')
    assert res.status_code == 200
    followup = donor_auth['client'].get('/api/me')
    assert followup.status_code == 401
