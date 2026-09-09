<?php

namespace App\Http\Controllers\API;

use App\Helpers\CommonHelper;
use App\Http\Controllers\Controller;
use App\Models\Admin;
use Illuminate\Http\Request;
use Spatie\Activitylog\Models\Activity;

class ActivityLogsApiController extends Controller
{
    public function getList(Request $request)
    {
        $query = Activity::with('causer')->orderBy('id', 'DESC');

        if ($request->filled('log_type')) {
            $query->where('log_name', $request->log_type);
        }

        if ($request->filled('event')) {
            $query->where('event', $request->event);
        }

        if ($request->filled('module')) {
            $query->where('subject_type', $request->module);
        }

        if ($request->filled('user_id')) {
            $query->where('causer_id', $request->user_id);
        }

        if ($request->filled('date')) {
            $query->whereDate('created_at', $request->date);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                    ->orWhere('log_name', 'like', "%{$search}%")
                    ->orWhereHas('causer', function ($cq) use ($search) {
                        $cq->where('username', 'like', "%{$search}%");
                    });
            });
        }

        $perPage = (int) ($request->get('per_page', 10));
        $activities = $query->paginate($perPage);

        $activities->getCollection()->transform(function (Activity $activity) {
            return $this->transform($activity);
        });

        return CommonHelper::responseWithData([
            'records' => $activities->items(),
            'total' => $activities->total(),
            'current_page' => $activities->currentPage(),
            'last_page' => $activities->lastPage(),
        ]);
    }

    public function show($id)
    {
        $activity = Activity::with('causer')->find($id);
        if (!$activity) {
            return CommonHelper::responseError('record_not_found');
        }

        return CommonHelper::responseWithData($this->transform($activity, true));
    }

    public function clearLogs(Request $request)
    {
        $olderThan = $request->get('older_than', '90');

        $query = Activity::query();

        if ($olderThan !== 'everything') {
            $days = (int) $olderThan;
            $query->where('created_at', '<', now()->subDays($days));
        }

        $deleted = $query->delete();

        return CommonHelper::responseSuccessWithData(__('logs_cleared_successfully'), ['deleted' => $deleted]);
    }

    public function filters()
    {
        $logTypes = Activity::select('log_name')->distinct()->orderBy('log_name')->pluck('log_name');
        $events = Activity::select('event')->whereNotNull('event')->distinct()->orderBy('event')->pluck('event');
        $modules = Activity::select('subject_type')->whereNotNull('subject_type')->distinct()->orderBy('subject_type')->pluck('subject_type')
            ->map(function ($type) {
                return ['value' => $type, 'label' => class_basename($type)];
            })->values();
        $userIds = Activity::select('causer_id')->whereNotNull('causer_id')->where('causer_type', Admin::class)->distinct()->pluck('causer_id');
        $users = Admin::with('role')->whereIn('id', $userIds)->get(['id', 'username', 'role_id'])
            ->map(function ($admin) {
                return ['id' => $admin->id, 'name' => $admin->username, 'role' => $admin->role->name ?? null];
            });

        return CommonHelper::responseWithData([
            'log_types' => $logTypes,
            'events' => $events,
            'modules' => $modules,
            'users' => $users,
        ]);
    }

    private function transform(Activity $activity, bool $withProperties = false)
    {
        $causer = $activity->causer;
        $subjectLabel = null;
        if ($activity->subject) {
            $subjectLabel = $activity->subject->name
                ?? $activity->subject->title
                ?? $activity->subject->username
                ?? null;
        }

        $data = [
            'id' => $activity->id,
            'date' => CommonHelper::formatDateTime($activity->created_at),
            'event' => $activity->event,
            'module' => class_basename($activity->subject_type),
            'subject_id' => $activity->subject_id,
            'subject_label' => $subjectLabel,
            'description' => $activity->description,
            'user' => $causer ? [
                'id' => $causer->id,
                'name' => $causer->username,
                'role' => $causer->role->name ?? null,
            ] : null,
        ];

        if ($withProperties) {
            $data['properties'] = $activity->properties;
        }

        return $data;
    }
}
