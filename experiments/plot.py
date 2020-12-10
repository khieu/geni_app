import matplotlib.pyplot as plt

num_trials = []
rtts = []
fig, ax = plt.subplots()
fn = 'rest_ms_10_d_100'
with open(f'outputs/{fn}.txt') as f:
    lines = f.read().split('\n')
    for l in lines:
        nt, _, rtt = l.split(',')
        num_trials.append(int(nt))
        rtts.append(float(rtt) / 1000)
        sorted(zip(num_trials, rtts))
ax.plot(num_trials, rtts, label='REST API')
ax.plot(num_trials, rtts, label='WebSocket')
ax.set_title('REST API vs WebSocket (message size: 10)')
ax.set_xlabel('number of requests')
ax.set_ylabel('rtt (s)')
ax.legend()
plt.savefig(f'imgs/{fn}.png')