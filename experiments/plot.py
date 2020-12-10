import matplotlib.pyplot as plt

msg_size = 10
delay = 100

fig, ax = plt.subplots()

num_trials = []
rtts = []
fn = f'rest_ms_{msg_size}_d_{delay}'
with open(f'outputs/{fn}.txt') as f:
    lines = f.read().split('\n')
    for l in lines:
        nt, _, rtt = l.split(',')
        num_trials.append(int(nt))
        rtts.append(float(rtt) / 1000)
        sorted(zip(num_trials, rtts))
ax.plot(num_trials, rtts, label='REST API')

num_trials = []
rtts = []
fn = f'sock_ms_{msg_size}_d_{delay}'
with open(f'outputs/{fn}.txt') as f:
    lines = f.read().split('\n')
    for l in lines:
        nt, _, rtt = l.split(',')
        num_trials.append(int(nt))
        rtts.append(float(rtt) / 1000)
        sorted(zip(num_trials, rtts))
ax.plot(num_trials, rtts, label='WebSocket')

ax.set_title(f'REST API vs WebSocket (message size: {msg_size}, delay: {delay})')
ax.set_xlabel('number of requests')
ax.set_ylabel('rtt (s)')
ax.legend()
plt.savefig(f'imgs/{fn}.png')